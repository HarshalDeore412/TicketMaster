const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const DBConnect = require("./config/dbConfig.js");
const dotenv = require("dotenv").config();
const cors = require("cors");

// Add routes
const userRoutes = require("./routes/user.js");
const ticketRoutes = require("./routes/ticket.js");

// Database connection
DBConnect();

app.use(express.json());

// Configure and apply CORS middleware
const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
};

app.use(cors());

// Custom headers for CORS
app.use((req, res, next) => { 
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins 
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS'); 
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); 
  next();
});

app.use("/api/user", userRoutes);
app.use("/api/ticket", ticketRoutes);

app.get("/", (req, res) => {
  res.send("hello there.....");
});

app.listen(PORT, () => {
  console.log(`app is live on ${PORT}`);
});
