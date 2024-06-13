const { Status } = require("../models/models");
const ApiError = require("../error/AppiError");

class StatusController {

  async add(req, res, next) {
    const { status_text } = req.body;
    if(!status_text)return next(ApiError.badRequest(`status_text is required`));

    try {
      const status = await Status.create({status_text });
      if (!status) {
        return next(ApiError.internal(`Problem with database`));
      }
      const listStatuses = await Status.findAll();
      return res.json({ status: 200, listStatuses });
    } catch (err) {
      return next(ApiError.internal(`Error adding status: ${err.message}`));
    }
  }

  async change(req, res, next) {
    const { status_id, status_text } = req.body;
    if(!status_text||!status_id)return next(ApiError.badRequest(`status_text and status_id is required`));

    try {
      const status = await Status.findByPk(status_id);
      if (!status) {
        return next(ApiError.badRequest("Status not found"));
      }
      await status.update({ status_text });
      const listStatuses = await Status.findAll();
      return res.json({ status: 200, listStatuses });
    } catch (err) {
      return next(ApiError.internal(`Error changing status: ${err.message}`));
    }
  }

  async delete(req, res, next) {
    const { status_id } = req.body;
    if(!status_id)return next(ApiError.badRequest(`status_id is required`));

    try {
      const deletedStatusCount = await Status.destroy({ where: { status_id } });
      if (!deletedStatusCount) {
        return next(ApiError.badRequest("Status not found"));
      }
      const listStatuses = await Status.findAll();

      return res.json({ status: 200, message: "Status deleted successfully", listStatuses });
    } catch (err) {
      return next(ApiError.internal(`Error deleting status: ${err.message}`));
    }
  }

  async list(req, res, next) {
    try {
      const listStatuses = await Status.findAll();
      return res.json({ status: 200, listStatuses });
    } catch (err) {
      return next(ApiError.internal(`Error listing statuses: ${err.message}`));
    }
  }
}

module.exports = new StatusController();
