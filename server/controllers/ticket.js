const User = require("../models/User");
const Ticket = require("../models/Ticket");
const mongoose = require("mongoose");

// Create Ticket
exports.createTicket = async (req, res) => {
  const { deskNo, issue, description } = req.body;

  const empid = req.user.empID;


  const user = await User.findOne({ empid });

  console.log(deskNo, issue, description);

  console.log("USER : :: : ", user);

  if (!user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const ticket = await Ticket.create({
      empID: user.empID,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      process: user.process,
      deskNo,
      issue,
      description,
    });

    console.log("Ticket created successfully:", ticket);

    return res.status(200).json({
      success: true,
      message: "ticket created successfully",
    });
  } catch (error) {
    // Handle specific errors
    if (error.name === "ValidationError") {
      // Handle validation errors
      console.error("Validation error:", error.message);
    } else if (error.name === "MongoError") {
      // Handle MongoDB errors
      console.error("MongoDB error:", error.message);
    } else {
      // Handle generic errors
      console.error("Unknown error:", error.message);
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });

    throw error;
  }
};

// Get All Tickets

exports.getAllTickets = async (req, res) => {
  try {
    console.log("Request received");

    // Validate request
    if (
      !req.headers["content-type"] ||
      req.headers["content-type"] !== "application/json"
    ) {
      throw new Error("Invalid content type");
    }

    // Fetch tickets
    const tickets = await Ticket.find().populate("empID");

    // Check if tickets exist
    if (!tickets || tickets.length === 0) {
      throw new Error("No tickets found");
    }

    console.log("tickets send");
    // console.log(tickets);

    res.status(200).json({
      success: true,
      message: "Tickets fetched successfully",
      tickets: tickets,
    });
  } catch (err) {
    console.error(err.message);

    // Handle specific errors
    if (err.name === "CastError") {
      res.status(400).json({ success: false, message: "Invalid ID" });
    } else if (err.name === "ValidationError") {
      res.status(400).json({ success: false, message: "Validation error" });
    } else if (err.message === "No tickets found") {
      res.status(404).json({ success: false, message: "No tickets found" });
    } else if (err.message === "Invalid content type") {
      res.status(415).json({ success: false, message: "Invalid content type" });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
};

exports.getMyTickets = async (req, res) => {
  try {
    // Validate user existence
    if (!req.user) {
      throw new Error("Unauthorized access");
    }

    // Extract empID from request user
    const empID = req.user.empID;
    console.log("emp", empID);

    // Validate empID existence
    if (!empID) {
      throw new Error("Employee ID not found");
    }

    // Find tickets by empID
    const myTickets = await Ticket.find({
      empID: new mongoose.Types.ObjectId(empID),
    });

    // Check if tickets exist
    if (!myTickets || myTickets.length === 0) {
      throw new Error("No tickets found");
    }

    console.log("My tickets fetched");

    return res.status(200).json({
      success: true,
      message: "My tickets fetched successfully",
      data: myTickets,
    });
  } catch (err) {
    console.error(err.message);

    // Handle specific errors
    if (err.message === "Unauthorized access") {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    } else if (err.message === "Employee ID not found") {
      return res
        .status(404)
        .json({ success: false, message: "Employee ID not found" });
    } else if (err.message === "No tickets found") {
      return res
        .status(404)
        .json({ success: false, message: "No tickets found" });
    } else if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    } else if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ success: false, message: "Validation error" });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
};

// Get Ticket by ID
exports.getTicketById = async (req, res) => {
  const id = req.params.id;
  console.log("Id : ", id);
  try {
    const ticket = await Ticket.findOne({ _id: id }).populate("empID");
    if (!ticket) {
      return res.status(404).send({ message: "Ticket not found" });
    }
    res.send(ticket);
  } catch (err) {
    res.status(400).send(err);
  }
};

// Update Ticket
exports.updateTicket = async (req, res) => {
  const id = req.params.id;
  const { ticket } = req.body;
  try {
    const isTicket = await Ticket.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!isTicket) {
      return res.status(404).send({ message: "Ticket not found" });
    }

    console.log(ticket);

    // Update ticket
    const updatedTicket = await Ticket.updateOne(
      { _id: id },
      {
        $set: {
          issue: ticket.issue,
          description: ticket.description,
          status: ticket.status,
        },
      }
    );
  } catch (err) {
    res.status(400).send(err);
  }
};

// Delete Ticket
exports.deleteTicket = async (req, res) => {
  const id = req.params.id;
  try {
    await Ticket.findByIdAndDelete({ _id: id });
    res.send({ message: "Ticket deleted successfully" });
  } catch (err) {
    res.status(400).send(err);
  }
};
