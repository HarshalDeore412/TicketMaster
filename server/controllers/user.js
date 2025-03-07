const USER = require("../models/User");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const OTP = require("../models/OTP");
const mailSender = require("../utils/mailSender");
const mongoose = require("mongoose");
const ForgotPass = require("../models/ForgotPass");
const { generateToken } = require('../utils/generateToken');
const nodemailer = require('nodemailer');
const newEmail = require('../MailTemplates/new-email.html');
const { uploadImageToCloudinary } = require('./ticket')

exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, process, email, empID, password, otp } =
      req.body;

    console.log("Received all the data");

    // Validate input
    if (
      !firstName ||
      !process ||
      !lastName ||
      !email ||
      !empID ||
      !password ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    console.log("Validated the data");

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    console.log("Email validated");

    const Email = email.toLowerCase();

    console.log("Email converted to lowercase");

    // Check OTP
    const isOtpAvailable = await OTP.findOne({ otp });
    if (!isOtpAvailable) {
      return res.status(404).json({
        success: false,
        message: "OTP does not match",
      });
    }

    console.log("OTP verified");

    // Hash password
    let hashPass;
    try {
      hashPass = await bcrypt.hash(password, 10);
    } catch (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({
        success: false,
        message: "Error hashing password",
        error: err.message,
      });
    }

    console.log("Password hashed");

    const existingUser = await USER.findOne({ empID });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this empID already exists",
      });
    }

    // Create user
    let response;
    try {
      response = await USER.create({
        firstName,
        lastName,
        process,
        email: Email,
        empID,
        password: hashPass,
      });
    } catch (err) {
      console.error("Error creating user:", err);
      return res.status(500).json({
        success: false,
        message: "Error creating user",
        error: err.message,
      });
    }

    console.log("User created:", response);

    // Remove OTP document
    try {
      await OTP.deleteOne({ otp });
    } catch (err) {
      console.error("Error deleting OTP:", err);
      return res.status(500).json({
        success: false,
        message: "Error deleting OTP",
        error: err.message,
      });
    }

    console.log("Deleted OTP");

    return res.status(200).json({
      success: true,
      message: "User created successfully",
      data: response,
    });
  } catch (err) {
    console.error("Internal Server Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// send otp
exports.sendOTP = async (req, res) => {
  console.log("OTP request received...");
  try {
    const { email } = req.body;

    // Check if email is empty
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const Email = email.toLowerCase();

    const User = await USER.findOne({ email: Email });

    // Check if user is already registered
    if (User) {
      return res.status(409).json({
        success: false,
        message: "User already registered. Please login...",
      });
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000); // Ensure OTP is always 4 digits

    // Create OTP document with email
    const otpDoc = await OTP.create({ email: Email, otp });

    // Check if OTP document created successfully
    if (!otpDoc) {
      return res.status(500).json({
        success: false,
        message: "Failed to create OTP document",
      });
    }

    // Send OTP via email
    try {
      await mailSender(Email, "OTP Verification", `Your OTP is ${otp}`);

      return res.status(200).json({
        success: true,
        message: "OTP sent successfully",
        otp, // Consider removing this in production for security
      });
    } catch (mailError) {
      console.error("Email sending error:", mailError);

      return res.status(500).json({
        success: false,
        message: "Failed to send OTP via email",
      });
    }
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const Email = email.toLowerCase();
    console.log("Email:", Email);

    // Check if user exists
    const User = await USER.findOne({ email: Email });
    console.log("User:", User);

    if (!User) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, User.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Wrong password",
      });
    }

    console.log("Password matched");

    // Create data payload for JWT
    const DATA = {
      user: {
        id: User.id,
        email: User.email,
      },
    };

    console.log("Data:", DATA);

    // Generate JWT token
    const authToken = JWT.sign(DATA, process.env.JWT_SECRET);

    console.log("Token created");

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      User: User,
      token: authToken,
    });
  } catch (err) {
    console.error("Error while logging in:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    // Validate content type
    if (
      !req.headers["content-type"] ||
      req.headers["content-type"] !== "application/json"
    ) {
      return res.status(415).json({
        success: false,
        message: "Invalid content type",
      });
    }

    // Fetch users
    const users = await USER.find();

    // Check if users exist
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    console.log("Users sent");

    // Return users
    return res.status(200).json({
      success: true,
      message: "User data retrieved successfully",
      users,
    });
  } catch (err) {
    // Handle specific errors
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    } else if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
      });
    } else {
      // Handle general errors
      console.error("Server error:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
};

exports.deleteUser = async (req, res) => {
  try {
    console.log("Request to delete user:", req.params._id);

    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // Check if the user ID is provided
    if (!req.params._id) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Check if the user ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params._id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    // Find the user to be deleted
    const userToDelete = await USER.findById(req.params._id);

    if (!userToDelete) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the user to be deleted is an admin
    if (userToDelete.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "You cannot delete an admin",
      });
    }

    // Check if the user is trying to delete themselves
    if (String(req.user._id) === req.params._id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete yourself",
      });
    }

    // Delete the user
    const deleteUser = await USER.deleteOne({ _id: req.params._id });

    // Check if the user was deleted successfully
    if (deleteUser.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Return a success response
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    // Handle specific errors
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    } else if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
      });
    } else {
      console.error("Error while deleting user:", err.message);
      // Return a generic error response
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
};

exports.updateUser = async (req, res) => {
  console.log("Request to update user info received");

  try {
    const { _id } = req.params;
    console.log(`User ID: ${_id}`);

    const { firstName, lastName, role } = req.body;
    console.log(`User data: firstName=${firstName}, lastName=${lastName}, role=${role}`);

    // Check if user ID is provided
    if (!_id) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    // Validate user ID format
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ success: false, message: "Invalid user ID format" });
    }

    // Find user by ID
    const user = await USER.findById(_id);
    console.log(`User found: ${user ? "Yes" : "No"}`);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update user data if values are provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (role) user.role = role;
    console.log(`Updated user data: firstName=${user.firstName}, lastName=${user.lastName}, role=${user.role}`);

    // Save updated user data
    await user.save();
    console.log("User data saved successfully");

    return res.status(200).json({ success: true, message: "User updated successfully", user });
  } catch (error) {
    // Handle specific errors
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid user ID format" });
    } else if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: "Validation error" });
    } else {
      console.error("Error occurred:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
};


// exports.updateProfile = async (req, res) => {
//   try {
//     const email = req.user.email;
//     console.log(`Request received for profile update for user: ${email}`);
//     let profilePictureUrl;

//     if (req.files && req.files.profilePicture) {
//       try {
//         profilePictureUrl = await uploadImageToCloudinary(req.files.profilePicture);
//         console.log(`Profile picture uploaded successfully: ${profilePictureUrl}`);
//       } catch (uploadError) {
//         console.error(`Cloudinary upload error: ${uploadError.message}`);
//         return res.status(500).json({
//           success: false,
//           message: "Error uploading profile picture",
//           error: uploadError.message,
//         });
//       }
//     }


//     console.log(`Profile picture URL: ${profilePictureUrl}`);

//     const updateData = {};
//     if (req.body.firstName) updateData.firstName = req.body.firstName;
//     if (req.body.lastName) updateData.lastName = req.body.lastName;
//     if (req.body.empID) updateData.empID = req.body.empID;
//     if (req.body.process) updateData.process = req.body.process;
//     if (req.body.role) updateData.role = req.body.role;
//     if (profilePictureUrl) updateData.profilePicture = profilePictureUrl;

//     console.log(`Updating user profile with data: ${JSON.stringify(updateData)}`);

//     const user = await USER.findOneAndUpdate(
//       { email: email },
//       updateData,
//       { new: true, runValidators: true }
//     );

//     if (!user) {
//       console.log(`User not found: ${email}`);
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     console.log(`Profile details updated successfully for user: ${email}`);
//     res.status(200).json({
//       success: true,
//       message: "Profile details updated successfully",
//       user,
//     });

//   } catch (error) {
//     console.error(`Error while updating profile details: ${error.message}`);
//     if (error.name === "ValidationError") {
//       console.log(`Validation error: ${error.message}`);
//       return res.status(400).json({
//         success: false,
//         message: "Validation error",
//         error: error.message,
//       });
//     } else if (error.name === "CastError") {
//       console.log(`Invalid data format: ${error.message}`);
//       return res.status(400).json({
//         success: false,
//         message: "Invalid data format",
//       });
//     } else {
//       console.log(`Internal server error: ${error.message}`);
//       return res.status(500).json({
//         success: false,
//         message: "Error while updating profile details",
//         error: error.message,
//       });
//     }
//   }
// };

exports.updateProfile = async (req, res) => {
  try {
    const email = req.user.email;
    let profilePictureUrl;

    if (req.files && req.files.profilePicture) {
      try {
        profilePictureUrl = await uploadImageToCloudinary(req.files.profilePicture);
        console.log(`Profile picture uploaded successfully: ${profilePictureUrl}`);
      } catch (uploadError) {
        console.error(`Cloudinary upload error: ${uploadError.message}`);
        return res.status(500).json({
          success: false,
          message: "Error uploading profile picture",
          error: uploadError.message,
        });
      }     
    }

    const updateData = {};
    if (req.body.firstName) updateData.firstName = req.body.firstName;
    if (req.body.lastName) updateData.lastName = req.body.lastName;
    if (req.body.empID) updateData.empID = req.body.empID;
    if (req.body.process) updateData.process = req.body.process;
    if (profilePictureUrl) updateData.profilePicture = profilePictureUrl;

    console.log(`Updating user profile with data: ${JSON.stringify(updateData)}`);

    const user = await USER.findOneAndUpdate(
      { email: email },
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      console.log(`User not found: ${email}`);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log(`Profile details updated successfully for user: ${email}`);
    res.status(200).json({
      success: true,
      message: "Profile details updated successfully",
      user,
    });
  } catch (error) {
    console.error(`Error while updating profile details: ${error.message}`);
    if (error.name === "ValidationError") {
      console.log(`Validation error: ${error.message}`);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.message,
      });
    } else if (error.name === "CastError") {
      console.log(`Invalid data format: ${error.message}`);
      return res.status(400).json({
        success: false,
        message: "Invalid data format",
      });
    } else {
      console.log(`Internal server error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: "Error while updating profile details",
        error: error.message,
      });
    }
  }
};

exports.getProfileDetails = async (req, res) => {
  try {
    console.log("Received request to fetch profile details");
    const user = req.user;
    console.log(`User object: ${JSON.stringify(user)}`);

    // Check if the user object and email exist
    if (!user || !user.email) {
      console.error("Invalid user email");
      return res.status(400).json({
        success: false,
        message: "Invalid user email",
      });
    }

    const email = user.email;
    console.log(`Fetching user details for email: ${email}`);

    // Fetch user details
    const userDetails = await USER.findOne({ email });
    console.log(`Fetched user details: ${JSON.stringify(userDetails)}`);

    // Check if user details exist
    if (!userDetails) {
      console.error("User details not found");
      return res.status(404).json({
        success: false,
        message: "User details not found",
      });
    }

    console.log("Returning user details in response");
    return res.status(200).json({
      success: true,
      message: "Details fetched successfully",
      profile: userDetails,
    });
  } catch (error) {
    console.error("Error while fetching user details:", error);

    // Handle specific errors
    if (error.name === "CastError") {
      console.error("Invalid data format");
      return res.status(400).json({
        success: false,
        message: "Invalid data format",
      });
    } else if (error.name === "ValidationError") {
      console.error("Validation error:", error.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.message,
      });
    } else {
      // Handle general errors
      console.error("Internal server error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
};


exports.ForgotPass = async (req, res) => {
  try {
    console.log('Forgot password request received');

    // Check if email is provided
    if (!req.body.email) {
      console.log('Email not provided. Returning 400 error');
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Email not provided',
        details: 'Please provide a valid email address',
      });
    }

    const Uemail = req.body.email;
    const email = Uemail.toLowerCase();

    // Check if email is valid
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email. Returning 400 error');
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Invalid email',
        details: 'Please provide a valid email address',
      });
    }

    const user = await USER.findOne({ email });
    console.log(`User found: ${user ? 'yes' : 'no'}`);

    if (!user) {
      console.log('User not found. Returning 404 error');
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'User not found',
        details: 'User with the provided email address does not exist',
      });
    }

    const token = await generateToken(user);
    console.log(`Token generated: ${token}`);

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"ADA Tech Solution Pvt Ltd " <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-10px); }
      to { opacity: 1; transform: translateX(0); }
    }
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f0f4f7;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      background-color: #ffffff;
      border: 1px solid #d1e3e8;
      border-radius: 10px;
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
      animation: fadeIn 1.5s ease-out;
    }
    .title {
      text-align: center;
      margin-bottom: 20px;
      font-weight: bold;
      color: #1a3e5b;
      font-size: 26px;
      animation: slideIn 1.5s ease-out;
    }
    .content {
      font-size: 16px;
      color: #3a3a3a;
      margin-bottom: 20px;
      animation: fadeIn 2s ease-out;
    }
    .button-container {
      text-align: center;
      margin-top: 20px;
      margin-bottom: 20px;
      animation: fadeIn 2.5s ease-out;
    }
    .button-container a {
      background-color: #28a745;
      color: #fff;
      padding: 12px 25px;
      border: none;
      border-radius: 5px;
      text-decoration: none;
      font-size: 16px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      transition: background-color 0.3s ease-in-out;
    }
    .button-container a:hover {
      background-color: #218838;
    }
    .expire {
      text-align: center;
      margin-top: 20px;
      font-size: 14px;
      color: #999;
      margin-bottom: 20px;
      animation: fadeIn 3s ease-out;
    }
    .support {
      font-size: 16px;
      color: #3a3a3a;
      margin-bottom: 20px;
      animation: fadeIn 3.5s ease-out;
    }
    .footer {
      font-size: 16px;
      color: #3a3a3a;
      margin-bottom: 20px;
      animation: fadeIn 4s ease-out;
    }
    .footer small {
      font-size: 12px;
      color: #999;
      animation: fadeIn 4.5s ease-out;
    }
    @media only screen and (max-width: 600px) {
      .container {
        padding: 15px;
      }
      .button-container a {
        padding: 10px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h2 class="title">Password Reset Request</h2>
    <p class="content">Dear ${user.firstName.toLowerCase().charAt(0).toUpperCase() + user.firstName.slice(1).toLowerCase()},</p>
    <p class="content">We have received a request to reset your password for your account. If you did not make this request, please ignore this email and your password will remain unchanged.</p>
    <p class="content">To reset your password, please click on the following link:</p>
    <div class="button-container">
      <a href="http://localhost:3000/reset-password/${token}">Reset Password</a>
    </div>
    <p class="expire">This link will expire in 1 hour.</p>
    <p class="support">If you have any issues resetting your password, please contact our support team at <a href="mailto:support@adatechsolutions.com" style="color: #0056b3;">support@adatechsolutions.com</a>.</p>
    <p class="footer">Best regards,</p>
    <p class="footer">ADA Tech Solution Pvt Ltd</p>
    <p class="footer"><small>ADA Tech Solution Pvt Ltd, All Rights Reserved.</small></p>
  </div>
</body>
</html>



        `,
    };

    console.log('Sending email...');

    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');

    console.log('Returning success response');
    return res.json({
      status: 'success',
      code: 200,
      message: 'Email sent successfully',
      details: 'Password reset link has been sent to your email address',
      data: {
        token: token,
        expires: '1 hour',
      },
    });
  } catch (error) {
    console.error('Error sending email:', error);

    if (error.code === 'EAUTH') {
      console.log('Authentication error. Returning 401 error');
      return res.status(401).json({
        status: 'error',
        code: 401,
        message: 'Authentication error',
        details: 'Invalid email or password',
      });
    } else if (error.code === 'ENOTFOUND') {
      console.log('Email not found. Returning 404 error');
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Email not found',
        details: 'User with the provided email address does not exist',
      });
    } else {
      console.log('Returning 500 error');
      return res.status(500).json({
        status: 'error',
        code: 500,
        message: 'Error sending email',
        details: 'Failed to send password reset email',
      });
    }
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Check if token and password are provided
    if (!token || !password) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Token and password are required',
        details: 'Please provide both token and password',
      });
    }

    const passwordReset = await ForgotPass.findOne({ token });

    // Check if token is valid
    if (!passwordReset) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Invalid token',
        details: 'The provided token is not valid',
      });
    }

    const user = await USER.findById(passwordReset.user);

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'User not found',
        details: 'The user associated with the token does not exist',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    await ForgotPass.deleteMany({ user: user._id });

    return res.json({
      status: 'success',
      code: 200,
      message: 'Password reset successfully',
      details: 'Your password has been reset successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Internal server error',
      details: 'An unexpected error occurred while resetting your password',
    });
  }
};
