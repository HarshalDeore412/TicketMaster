const crypto = require('crypto');
const ForgotPass = require('../models/ForgotPass');

// Generate a token function
const generateToken = async (user) => {
  // Create a unique token
  const token = crypto.randomBytes(32).toString('hex');

  // Create a new ForgotPass document
  const forgotPass = new ForgotPass({
    user: user._id,
    token,
  });

  // Save the document to the database
  await forgotPass.save();

  // Return the token
  return token;
};

module.exports = { generateToken };
