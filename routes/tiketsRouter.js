const express = require("express");
const router = express.Router();
const TicketController = require("../controlers/tiketsController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/authMiddleware");


router.get("/my-tickets", authMiddleware, TicketController.getUserTickets);
router.get("/my-tickets/status/:status", authMiddleware, TicketController.getUserTicketsByStatus);
router.get("/all-tickets", adminMiddleware, TicketController.getAllTickets);
router.get("/all-tickets/status/:status", adminMiddleware, TicketController.getAllTicketsByStatus);
router.post("/create-ticket", authMiddleware, TicketController.createTicket);
router.post("/respond-ticket/:ticket_id", adminMiddleware, TicketController.respondTicket);
router.put("/update-ticket-status/:ticket_id", adminMiddleware, TicketController.updateTicketStatus);

module.exports = router;