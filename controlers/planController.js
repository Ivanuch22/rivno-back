const { Plan,Addon } = require("../models/models");
const ApiError = require("../error/AppiError");

class PlanController {

  async add(req, res, next) {
    const { stripe_id_mo,stripe_id_y, name, price_mo, price_y, messages_count, sites_count } = req.body;
    if(!stripe_id_y)return next(ApiError.badRequest(`stripe_id_y is required`));
    if(!stripe_id_mo)return next(ApiError.badRequest(`stripe_id_mo is required`));
    if(!name)return next(ApiError.badRequest(`name is required`));
    if(!price_mo)return next(ApiError.badRequest(`price_mo is required`));
    if(!price_y)return next(ApiError.badRequest(`price_y is required`));
    if(!messages_count)return next(ApiError.badRequest(`messages_count is required`));
    if(!sites_count)return next(ApiError.badRequest(`sites_count is required`));
    
    try {
      const plan = await Plan.create({ stripe_id_mo,stripe_id_y, name, price_mo, price_y, messages_count, sites_count });

      if (!plan) {
        return next(ApiError.internal(`Problem with database`));
      }

      const listPlans = await Plan.findAll();

      return res.json({ status: 200, listPlans });
    } catch (err) {
      return next(ApiError.internal(`Error adding plan: ${err.message}`));
    }
  }

  async change(req, res, next) {
    const {plan_id, stripe_id_mo,stripe_id_y, name, price_mo, price_y, messages_count, sites_count } = req.body;
    if(!stripe_id_y)return next(ApiError.badRequest(`stripe_id_y is required`));
    if(!stripe_id_mo)return next(ApiError.badRequest(`stripe_id_mo is required`));
    if(!plan_id)return next(ApiError.badRequest(`plan_id is required`));

    
    try {
      const plan = await Plan.findByPk(plan_id);

      if (!plan) {
        return next(ApiError.badRequest("Plan not found"));
      }
      await plan.update({ stripe_id_mo,
        stripe_id_y, name, price_mo, price_y, messages_count, sites_count });
      return res.json({ status: 200, message: "Plan is updated" });
    } catch (err) {
      return next(ApiError.internal(`Error changing plan: ${err.message}`));
    }
  }

  async delete(req, res, next) {
    const { plan_id } = req.body;
    if(!plan_id)return next(ApiError.badRequest(`plan_id is required`));
    
    try {
      const deletedPlanCount = await Plan.destroy({ where: { plan_id } });

      if (!deletedPlanCount) {
        return next(ApiError.badRequest("Plan not found"));
      }

      const listPlans = await Plan.findAll();

      return res.json({ status: 200, message: "Plan deleted successfully", listPlans });
    } catch (err) {
      return next(ApiError.internal(`Error deleting plan: ${err.message}`));
    }
  }

  async list(req, res, next) {
    try {
      const listPlans = await Plan.findAll({
        include: [
          {
            model: Addon,
            as: "addons", // Важливо вказати асоціацію
            required: false, // Аддони можуть бути або не бути для кожного плану
          },
        ],
      });
      
      return res.json({ status: 200, listPlans });
    } catch (err) {
      return next(ApiError.internal(`Error listing plans: ${err.message}`));
    }
  }
}

module.exports = new PlanController();
