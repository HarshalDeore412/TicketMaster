// server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const DBConnect = require("./config/dbConfig.js")
const dotenv = require("dotenv").config();
const cors = require('cors');

// add routes
const userRoutes = require("./routes/user.js")
const ticketRoutes = require("./routes/ticket.js");

// database connection 
DBConnect();


app.use(express.json());

app.use( 
  cors({
    origin:"http://localhost:3000",
    credential:true,
  })
 )

 app.use('/api/user' , userRoutes);
 app.use('/api/ticket', ticketRoutes)

 app.get("/" , (req,res) => {
  res.send("hello there.....");
 } )

 app.listen( PORT , () => {
  console.log(`app is live on ${PORT}`);
 } )

 