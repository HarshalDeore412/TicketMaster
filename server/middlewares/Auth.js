const JWT = require('jsonwebtoken');
require("dotenv").config();
const USER = require("../models/User");

exports.auth = async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ success: false, message: 'TOKEN MISSING' });
      }
  
      try {
        const decode = JWT.verify(token, process.env.JWT_SECRET);
 
        const user = await USER.findOne({ email: decode.user.email });
        if (!user) {
          return res.status(401).json({ success: false, message: "User not found" });
        }
        req.user = user;

        console.log('user authentication done......')
        next();
      } catch (error) {
        console.error('ERROR VERIFING TOKEN ', error.message);
        return res.status(401).json({ success: false, message: "Invalid token" });
      }
    } catch (error) {
      console.error('Unexpected error', error.message);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
  exports.isAdmin = async (req, res, next) => {
    try {
      const user = req.user;
    //   console.log('user :  ' , req )
      if (!user || user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Forbidden : You Are Not Authorized to this page" });
      }
      console.log('admin Authentication done......')
      next();
    } catch (err) {
      console.error("Error checking admin role", err.message);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  