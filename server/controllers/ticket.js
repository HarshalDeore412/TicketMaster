const User = require("../models/User");
const Ticket = require("../models/Ticket");
const mongoose = require("mongoose");
const { createObjectCsvWriter } = require("csv-writer");
const fs = require("fs");
const path = require("path");
const { ObjectId } = require('mongodb');




// Create Ticket
exports.createTicket = async (req, res) => {
  const { deskNo, issue, description } = req.body;

  const empid = req.user.empID;
  console.log("user  :", req.user);

  const user = await User.findOne({ empID: req.user.empID });

  console.log(deskNo, issue, description);

  console.log("USER  ", user);

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

    // Get query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const empID = req.query.empID;
    const status = req.query.status;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    // Create query object
    const query = {};
    if (empID) query.empID = empID;
    if (status) query.status = status;
    if (startDate && endDate) {
      query.dateTime = { $gte: startDate, $lte: endDate };
    }

    // Fetch tickets with pagination
    const tickets = await Ticket.find(query)
      .populate("empID")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ dateTime: -1 });

    // Get total count
    const totalCount = await Ticket.countDocuments(query);

    // Check if tickets exist
    if (!tickets || tickets.length === 0) {
      return res.status(404).json({
        success: false,
        message: "You Have Not Raise Any Tickets Yet..",
      });
    }

    console.log("tickets send");

    res.status(200).json({
      success: true,
      message: "Tickets fetched successfully",
      tickets: tickets,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
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
  console.log("Request received for ticket update");
  const _id = req.params._id;
  const { ticket } = req.body;

  console.log("_ID :", _id);
  console.log("Ticket :", ticket);

  try {
    // Find the ticket by ID and update with new details
    const updatedTicket = await Ticket.findByIdAndUpdate(
      _id,
      {
        issue: ticket.issue,
        description: ticket.description,
        status: ticket.status,
        Note : ticket.Note
      },
      {
        new: true,
      }
    );

    if (!updatedTicket) {
      console.log("Ticket Not Found");
      return res.status(404).send({ message: "Ticket not found" });
    }

    console.log("Updated Ticket:", updatedTicket);

    res.status(200).send({
      message: "Ticket updated successfully",
      updatedTicket,
    });
  } catch (err) {
    console.error(err.message);
    res.status(400).send(err);
  }
};

// Delete Ticket
exports.deleteTicket = async (req, res) => {
  console.log(req.params);

  const id = req.params.id;

  // Check if id is a valid string
  if (typeof id !== 'string') {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }

  try {
    const deletedTicket = await Ticket.findByIdAndDelete(id);

    if (!deletedTicket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
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
    console.log(`Employee ID: ${empID}`);

    // Validate empID existence
    if (!empID) {
      throw new Error("Employee ID not found");
    }

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Find tickets by empID with pagination
    const myTickets = await Ticket.find({ empID })
      .skip((page - 1) * limit)
      .limit(limit);

    // Count total tickets
    const totalCount = await Ticket.countDocuments({ empID });

    // Check if tickets exist
    if (!myTickets || myTickets.length === 0) {
      return res.status(404).json({
        success: false,
        message: "You Have Not Raise Any Tickets Yet..",
      });
    }

    console.log("My tickets fetched successfully");
    return res.status(200).json({
      success: true,
      message: "My tickets fetched successfully",
      data: myTickets,
      pagination: {
        page,
        limit,
        totalCount,
      },
    });
  } catch (err) {
    console.error(`Error: ${err.message} | Stack: ${err.stack}`);

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




exports.downloadReport = async (req, res) => {
  const { startDate, endDate, status, empID } = req.query;
  const query = {};

  if (startDate && endDate) {
    query.dateTime = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
  if (status) {
    query.status = status;
  }
  if (empID) {
    query.empID = empID;
  }

  try {
    // Ensure reports directory exists
    const reportsDir = path.join(__dirname, 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir);
    }

    const tickets = await Ticket.find(query);
    console.log('download report query tickets', tickets);

    // Modify tickets data to split date and time
    const modifiedTickets = tickets.map(ticket => {
      const dateTime = new Date(ticket.dateTime);

      // Function to format time in 12-hour format with AM/PM
      const formatTime = (date) => {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // The hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutes} ${ampm}`;
      };

      return {
        ...ticket.toObject(), // toObject() to convert Mongoose document to plain JavaScript object
        date: dateTime.toISOString().split('T')[0], // Extract date part
        time: formatTime(dateTime), // Extract time part in 12-hour format with AM/PM
      };
    });

    const csvWriter = createObjectCsvWriter({
      path: path.join(reportsDir, 'tickets_report.csv'),
      header: [
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
        { id: 'process', title: 'Process' },
        { id: 'deskNo', title: 'Desk No' },
        { id: 'issue', title: 'Issue' },
        { id: 'description', title: 'Description' },
        { id: 'date', title: 'Date' },
        { id: 'time', title: 'Time' },
        { id: 'status', title: 'Status' },
        { id: 'Note', title: 'Note' },
        { id: 'empID', title: 'Emp ID' },
      ],
    });

    await csvWriter.writeRecords(modifiedTickets);
    res.download(
      path.join(reportsDir, 'tickets_report.csv'),
      'tickets_report.csv'
    );
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({
      success:false,
      error : error.message,
      message : "INTERNAL SERVER ERROR"
    })
  }
};

