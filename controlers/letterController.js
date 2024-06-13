const { LetterArchive, User, Status} = require("../models/models");
const ApiError = require("../error/AppiError");
const { Op } = require("sequelize");
const { addDays, startOfDay, startOfWeek, startOfMonth, startOfYear } = require("date-fns");

class LetterController {

  async add(req, res, next) {
    try {
      const {email}= req.user
      const { body, site_id } = req.body;
      if(!email)return next(ApiError.badRequest(`user not found`));
      if(!body)return next(ApiError.badRequest(`body is required`));
      if(!site_id)return next(ApiError.badRequest(`site_id is required`));

      const status_id = 1; 
      const status = await Status.findOne({ where: { status_id } });
      if(!status) return next(ApiError.badRequest(`status not found create some status`));

      const user = await User.findOne({ where: { email } });
      const user_id = user.id;
      const letter = await LetterArchive.create({ body, site_id, user_id, status_id });
      return res.json({ status: 200, letter });
    } catch (err) {
      return next(ApiError.internal(`Error adding letter: ${err.message}`));
    }
  }

  async delete(req, res, next) {
    try {
      const { letter_id } = req.body;
      if(!letter_id)return next(ApiError.badRequest(`letter_id is required`));

      const deletedCount = await LetterArchive.destroy({ where: { letter_id } });

      if (!deletedCount) {
        return next(ApiError.badRequest("Letter not found"));
      }

      return res.json({ status: 200, message: "Letter deleted successfully" });
    } catch (err) {
      return next(ApiError.internal(`Error deleting letter: ${err.message}`));
    }
  }

  async changeStatus(req, res, next) {
    try {
      const { letter_id, status_id } = req.body;
      if(!letter_id||!status_id)return next(ApiError.badRequest(`letter_id and status_id is required`));
      const letter = await LetterArchive.findByPk(letter_id);
      if (!letter) {
        return next(ApiError.badRequest("Letter not found"));
      }
      await letter.update({ status_id });

      return res.json({ status: 200, message: "Letter status updated" });
    } catch (err) {
      return next(ApiError.internal(`Error changing letter status: ${err.message}`));
    }
  }

  async getUserLetters(req, res, next) {
    try {
      const user_id = req.user.id; 
      if(!user_id)return next(ApiError.badRequest(`user is not authorized`));

      const letters = await LetterArchive.findAll({ where: { user_id } });

      return res.json({ status: 200, letters });
    } catch (err) {
      return next(ApiError.internal(`Error fetching user's letters: ${err.message}`));
    }
  }

  async getLettersByStatus(req, res, next) {
    try {
      const user_id = req.user.id;
      const { status_id } = req.params;
      if(!status_id)return next(ApiError.badRequest(`status_id is required`));
      
      const letters = await LetterArchive.findAll({ where: { user_id, status_id } });

      return res.json({ status: 200, letters });
    } catch (err) {
      return next(ApiError.internal(`Error fetching letters by status: ${err.message}`));
    }
  }

  async getLettersByTimeframe(req, res, next) {
    try {
      const user_id = req.user.id;
      const { period } = req.params;
      const defaultPeriod = period || 'month';
      const now = new Date();

      let dateFilter;
      switch (defaultPeriod) {
        case 'day':
          dateFilter = startOfDay(now);
          break;
        case 'week':
          dateFilter = startOfWeek(now);
          break;
        case 'month':
          dateFilter = startOfMonth(now);
          break;
        case 'half-year':
          dateFilter = addDays(now, -183);
          break;
        default:
          return next(ApiError.badRequest("Invalid timeframe"));
      }

      const letters = await LetterArchive.findAll({ 
        where: { 
          user_id,
          createdAt: {
            [Op.gte]: dateFilter,
          }
        }
      });

      return res.json({ status: 200, letters });
    } catch (err) {
      return next(ApiError.internal(`Error fetching letters by timeframe: ${err.message}`));
    }
  }
}

module.exports = new LetterController();
