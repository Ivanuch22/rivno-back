const {  User, Order} = require("../models/models");
const ApiError = require("../error/AppiError");

class OrderController {

  async create(req, res, next) {
    try {
      const {id}= req.user
      const { order } = req.body;
      if(!id)return next(ApiError.badRequest(`user not found`));
      if(!order)return next(ApiError.badRequest(`body is required`));

      const user = await User.findOne({ where: { id } });
      if(!user)return next(ApiError.badRequest(`user not found`));

      const createOrder = await Order.create({...order, user_id: id, status_id: 1})
      if(!createOrder) return next(ApiError.badRequest("order not created"))
      return res.json({ message: "order success created" });
    } catch (err) {
      return next(ApiError.internal(`Error adding letter: ${err.message}`));
    }
  }
  async getAll (req,res,next){
    try {
        const {id}= req.user
        if(!id)return next(ApiError.badRequest(`user not found`));
  
        const user = await User.findOne({ where: { id } });
        if(!user)return next(ApiError.badRequest(`user not found`));
  
        const getOrders = await Order.findAll({where: {user_id:id}})
        if(!getOrders) return res.json({ orders:[] });
        return res.json({orders:getOrders});
      } catch (err) {
        return next(ApiError.internal(`Error adding letter: ${err.message}`));
      }
  }

}

module.exports = new OrderController();
