const {  Site } = require("../models/models");
const ApiError = require("../error/AppiError");
const {uuidv7} = require("uuidv7");


class SiteController {

  async add(req, res, next) {
    const { link } = req.body
    const { id } = req.user
    if(!link)return next(ApiError.badRequest(`Link is required`));
    try {
      const getKey = uuidv7();
      const site = await Site.create({
        link,
        user_id: id,
        key: getKey
      });
      if (!site) return next(ApiError.internal(`Problem with db`));
      const listSites = await Site.findAll({ where: { user_id: id } });
      if (!listSites) return next(ApiError.internal(`Problem with db`));
      return res.json({ status: 200, listSites });
    } catch (error){
      return next(ApiError.internal("Internal Server Error", error));

    }
  }
  async change(req, res, next) {
    const {site_id, link} = req.body;
    const { id } = req.user
    if(!site_id || !link)return next(ApiError.badRequest(`link and site_id is required`));
    try {
      const candidate = await Site.findOne({ where: { site_id:site_id,user_id:id } });
      if(!candidate) return next(ApiError.badRequest("Not Found"))
      await candidate.update({link:link});
      const listSites = await Site.findAll({ where: { user_id: id } });
      if (!listSites) return next(ApiError.internal(`Proble with db`));
      return res.json({ status: 200, listSites });
    } catch(error) {
      return next(ApiError.internal("Internal Server Error", error));

    }
  }
  async list(req, res, next) {
    const { id } = req.user
    try {
      const listSites = await Site.findAll({ where: { user_id: id } });
      if(!listSites) return next(ApiError.badRequest("Not Found"))
      return res.json({ status: 200, listSites });
    } catch (error){
      return next(ApiError.internal("Internal Server Error", error));

    }
  }

  async delete(req, res, next) {
    const { id } = req.user;
    const { site_id } = req.body;

    if(!site_id)return next(ApiError.badRequest(`site_id is required`));
  
    try {
      const deleteSite = await Site.destroy({ where: { user_id: id, site_id: site_id } });
      if (!deleteSite) {
        return next(ApiError.badRequest("Site not found"));
      }
      const updatedSites = await Site.findAll({ where: { user_id: id } });
      
      return res.json({ status: 200, message: "Site deleted successfully", listSites: updatedSites });
    } catch (error) {
      return next(ApiError.internal("Internal Server Error", error));

    }
  }
  async regenerateKey(req, res, next) {
    const { site_id } = req.body;
    const { id } = req.user;
    if(!site_id)return next(ApiError.badRequest(`site_id is required`));
    try {
      const getSite = await Site.findOne({ where: { site_id:site_id,user_id:id } });
      if (!getSite) return next(ApiError.badRequest("Site not found"));
      const newKey = uuidv7();
      await getSite.update({ key: newKey });
      return res.json({ status: 200, message: "Site key regenerated successfully", newKey });
    } catch (error) {
      return next(ApiError.internal("Internal Server Error", error));

    }
  }

}

module.exports = new SiteController();


