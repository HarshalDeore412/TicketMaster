const express = require('express');
const router = express.Router();
const User = require("../controllers/user")
const Ticket = require("../controllers/ticket");
const { auth, isAdmin } = require('../middlewares/Auth');

router.post('/create-user', User.createUser);
router.post("/user-login" , User.loginUser);
router.post("/send-otp", User.sendOTP);
router.get('/getMyTickets',auth, Ticket.getMyTickets)
router.get('/getUsers'  , User.getUsers)
router.delete('/deleteUser/:_id' ,auth, isAdmin ,User.deleteUser)
router.patch('/updateUser/:_id',auth , isAdmin, User.updateUser);

module.exports = router;

