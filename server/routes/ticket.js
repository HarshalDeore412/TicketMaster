// routes/tickets.js
const express = require('express');
const router = express.Router();
const Ticket = require('../controllers/ticket');
const { auth , isAdmin } = require("../middlewares/Auth");

router.post("/create-ticket"  ,auth, Ticket.createTicket);
router.get("/get-all-tickets",auth , isAdmin ,Ticket.getAllTickets);
router.get("/get-ticket-by-id/:id",auth , Ticket.getTicketById);
router.patch("/update-ticket/:_id" ,auth, isAdmin, Ticket.updateTicket );
router.delete("/delete-ticket/:id" ,auth , isAdmin, Ticket.deleteTicket);
router.get('/download-report', auth , isAdmin , Ticket.downloadReport);

module.exports = router;
