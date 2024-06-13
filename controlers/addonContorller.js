const { Addon, Plan } = require("../models/models");
const ApiError = require("../error/AppiError");


class AddonController {
    async createAddon(req, res, next) {
      const { stripe_id, name, price, messages_count, sites_count, plan_id } = req.body;
      if(!stripe_id||!name||!price||!messages_count||!sites_count||!plan_id)return next(ApiError.badRequest("stripe_id, name, price, messages_count, sites_count, plan_id is required"))
  
      try {
        plan_id
        const existingPlan = await Plan.findOne({ where: { plan_id } });
        if(!existingPlan)return next(ApiError.badRequest("enter correct plan id or create new"))
        const existingAddon = await Addon.findOne({ where: { stripe_id } });
  
        if (existingAddon) {
          return next(ApiError.badRequest("Addon with this stripe_id already exists"));
        }
  
        const newAddon = await Addon.create({
          stripe_id,
          name,
          price,
          messages_count,
          sites_count,
          plan_id,
        });
  
        res.status(201).json({ message: "Addon created", addon: newAddon });
      } catch (error) {
        next(ApiError.internal(error.message));
      }
    }
  
    async updateAddon(req, res, next) {
      const { addon_id,stripe_id, name, price, messages_count, sites_count, plan_id } = req.body;
      if(!addon_id) return next(ApiError.badRequest("addon_id is required"))
      try {
        const addon = await Addon.findOne({ where: { addon_id } });
  
        if (!addon) {
          return next(ApiError.badRequest("Addon not found"));
        }
  
        await addon.update({
          name,
          price,
          stripe_id,
          messages_count,
          sites_count,
          plan_id,
        });
  
        res.status(200).json({ message: "Addon updated", addon });
      } catch (error) {
        next(ApiError.internal(error.message));
      }
    }
  
    async deleteAddon(req, res, next) {
      const { addon_id } = req.body;
      if(!addon_id) return next(ApiError.badRequest("addon_id is required"))

      try {
        const addon = await Addon.findByPk(addon_id);
  
        if (!addon) {
          return next(ApiError.badRequest("Addon not found"));
        }
  
        await addon.destroy();
  
        res.status(200).json({ message: "Addon deleted" });
      } catch (error) {
        next(ApiError.internal(error.message));
      }
    }
  
    async getAllAddons(req, res, next) {
      try {
        const addons = await Addon.findAll();
  
        res.status(200).json({ addons });
      } catch (error) {
        next(ApiError.internal(error.message));
      }
    }
  
    async getAddonsByPlanId(req, res, next) {
      const { plan_id } = req.params;
      if(!plan_id) return next(ApiError.badRequest("addon_id is required"))
  
      try {
        const addons = await Addon.findAll({ where: { plan_id } });
  
        if (addons.length === 0) {
          return next(ApiError.badRequest("No addons found for this plan"));
        }
  
        res.status(200).json({ addons });
      } catch (error) {
        next(ApiError.internal(error.message));
      }
    }
  }
  
  module.exports = new AddonController();