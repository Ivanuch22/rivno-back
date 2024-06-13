const { Ticket,User } = require("../models/models");
const { send } = require("../services/emailService")
const ApiError = require("../error/AppiError");

class TicketController {
  async createTicket(req, res, next) {
    const { message } = req.body;
    const { id: user_id } = req.user;
    if(!user_id)return next(ApiError.badRequest("user_id is required"))
    
    try {
      const newTicket = await Ticket.create({
        user_id,
        message
      });

      res.status(201).json({ ticket: newTicket });
    } catch (error) {
      next(ApiError.internal(error.message));
    }
  }

  async respondTicket(req, res, next) {
    const { ticket_id } = req.params;
    const { response } = req.body;
    const { id: admin_id } = req.user;
    if(!response)return next(ApiError.badRequest("response is required"))
    if(!ticket_id)return next(ApiError.badRequest("ticket_id is required"))


    try {
      const ticket = await Ticket.findByPk(ticket_id);

      if (!ticket) {
        return next(ApiError.badRequest("Ticket not found"));
      }

      const user_id = ticket.user_id;

      const user = await User.findOne({ where: { id: user_id } });

      if (!user) {
        return next(ApiError.badRequest("User not found"));
      }

      await ticket.update({
        admin_response: response,
        admin_id,
      });

      await send(user.email, "Відповідь від адміністрації", "У вас є відповідь від адміністрації");

      res.status(200).json({ message: "Response added to the ticket" });
    } catch (error) {
      next(ApiError.internal(error.message));
    }
  }

  async updateTicketStatus(req, res, next) {
    const { ticket_id } = req.params;
    const { status } = req.body;
    if(!status)return next(ApiError.badRequest("status is required"))
    if(!ticket_id)return next(ApiError.badRequest("ticket_id is required"))
    try {
      const ticket = await Ticket.findByPk(ticket_id);

      if (!ticket) {
        return next(ApiError.badRequest("Ticket not found"));
      }

      await ticket.update({
        status,
      });

      res.status(200).json({ message: "Ticket status updated" });
    } catch (error) {
      next(ApiError.internal(error.message));
    }
  }

  async getUserTickets(req, res, next) {
    const { id: user_id } = req.user;

    try {
      const userTickets = await Ticket.findAll({
        where: { user_id: user_id },
      });

      res.status(200).json({ tickets: userTickets });
    } catch (error) {
      next(ApiError.internal("Error retrieving tickets"));
    }
  }

  async getUserTicketsByStatus(req, res, next) {
    const { id: user_id } = req.user;
    const { status } = req.params;
    if(!status)return next(ApiError.badRequest("status is required"))

    try {
      const userTickets = await Ticket.findAll({
        where: { user_id: user_id, status: status },
      });

      res.status(200).json({ tickets: userTickets });
    } catch (error) {
      next(ApiError.internal("Error retrieving tickets by status"));
    }
  }

  async getAllTickets(req, res, next) {
    try {
      const allTickets = await Ticket.findAll();

      res.status(200).json({ tickets: allTickets });
    } catch (error) {
      next(ApiError.internal("Error retrieving all tickets"));
    }
  }

  async getAllTicketsByStatus(req, res, next) {
    const { status } = req.params;
    if(!status)return next(ApiError.badRequest("status is required"))

    try {
      const tickets = await Ticket.findAll({
        where: { status: status },
      });

      res.status(200).json({ tickets: tickets });
    } catch (error) {
      next(ApiError.internal("Error retrieving tickets by status"));
    }
  }
}

module.exports = new TicketController();
