const USER = require("../models/User");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const OTP = require("../models/OTP");
const mailSender = require("../utils/mailSender");

exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, process, email, empID, password, otp } =
      req.body;

    console.log("recived all the data");

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

    console.log("validated the data");

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    console.log("email validated ");

    const Email = email.toLowerCase();

    console.log("email converted to lowercase");

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
    const hashPass = await bcrypt.hash(password, 10).catch((err) => {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Error hashing password",
        error: err.message,
      });
    });

    console.log("password hashed  ");

    // Create user
    const response = await USER.create({
      firstName,
      lastName,
      process,
      email: Email,
      empID,
      password: hashPass,
    }).catch((err) => {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Error creating user",
        error: err.message,
      });
    });

    console.log("user created :");

    // Remove OTP document
    await OTP.deleteOne({ otp }).catch((err) => {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Error deleting OTP",
        error: err.message,
      });
    });

    console.log("deleted OTP");

    return res.status(200).json({
      success: true,
      message: "User created successfully",
      data: response,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// send otp

exports.sendOTP = async (req, res) => {
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

    const User = await USER.findOne({ Email });

    // Check if user is already registered
    if (User) {
      return res.status(301).json({
        success: false,
        message: "User already registered. Please login...",
      });
    }

    // Generate OTP
    const otp = Math.floor(Math.random() * 10000);

    // Create OTP document with email
    const otpDoc = await OTP.create({ Email, otp });

    // Check if OTP document created successfully
    if (!otpDoc) {
      return res.status(500).json({
        success: false,
        message: "Failed to create OTP document",
      });
    }

    // Send OTP via email
    try {
      // await mailSender(Email, `Registration OTP`, `Your OTP is ${otp}`);
      await mailSender(Email, "OTP Verification", `${otp}`);

      return res.status(200).json({
        success: true,
        message: "OTP sent successfully",
        otp,
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
      message: "Internal Server Error...",
    });
  }
};

// login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const Email = email.toLowerCase();
    console.log(Email);
    const User = await USER.findOne({ email: Email });
    console.log("USER ", User);

    if (!User) {
      return res.status(404).json({
        success: false,
        message: "USER NOT FOUND",
      });
    }

    if (await bcrypt.compare(password, User.password)) {
      console.log("PASSWORD MATCHED");
      const DATA = {
        user: {
          id: User.id,
          email: User.email,
        },
      };

      console.log("DATA : ", DATA);

      const authToken = JWT.sign(DATA, process.env.JWT_SECRET);

      console.log("TOKEN CREATED");

      return res.status(200).json({
        success: true,
        message: "USER LOGED IN SUCCESSFULY",
        User,
        token: authToken,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "wrong password",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "ERROR WHOILE LOG IN...!",
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    // Validate request
    if (
      !req.headers["content-type"] ||
      req.headers["content-type"] !== "application/json"
    ) {
      throw new Error("Invalid content type");
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

    console.log("users send");

    // Return users
    return res.status(200).json({
      success: true,
      message: "User data retrieved successfully",
      users: users,
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
    } else if (err.message === "Invalid content type") {
      return res.status(415).json({
        success: false,
        message: "Invalid content type",
      });
    } else {
      // Handle general errors
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
};

exports.deleteUser = async (req, res) => {
  try {
    console.log("request to delete user", req.param._id);

    const { _id } = req.param;

    const deleteUser = await USER.deleteOne(_id);

    if (deleteUser) {
      return res.status(200).json({
        success: true,
        message: "user deleted successfully",
      });
    }

    console.log("user deleted successfully", deleteUser);
  } catch (err) {
    console.log("error while creating user :", err.message);

    return res.status(500).json({
      success: false,
      message: "INTERNAL SERVER ERROR",
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { _id } = req.params;
    const { name, email, role } = req.body;

    const user = await User.findById({ _id });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    user.name = name;
    user.email = email;
    user.role = role;

    await user.save();

    res.send({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {

    const _email_ = req.user.email;

    console.log('request come for profile update')
    const { firstName, lastName, jobTitle, phone } =
      req.body;
    const user = await User.findOneAndUpdate(
      { _email_ },
      { firstName, lastName, jobTitle, companyName, phone },
      { new: true }
    );
   res.status(200).json({
    success:true,
    message: "Profile Details Updated Successfully"
   })
  } catch (error) {
    res.status(500).json({
      success:true,
      message: "Error While updating Profile Detail"
     })
  }
};


exports.getProfileDetails = async (req, res) => {
  try {
    const user = req.user;
    const email = user.email;

    // Validate and sanitize user email
    if (!email) {
      return res.status(400).json({ success: false, message: 'Invalid user email' });
    }

    const userDetails = await USER.findOne({ email });

    // Check if user details exist
    if (!userDetails) {
      return res.status(404).json({ success: false, message: 'User details not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Details fetched successfully',
      profile: userDetails,
    });
  } catch (error) {
    // Handle Mongoose errors specifically

    // Generic error handling
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};
