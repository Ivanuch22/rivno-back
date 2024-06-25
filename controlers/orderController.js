const {  User, Order,Status} = require("../models/models");
const ApiError = require("../error/AppiError");
const {S3} = require('../services/s3Service');

class OrderController {

  async create(req, res, next) {
    try {
      const {id}= req.user
      const { order } = req.body;
      if(!id)return next(ApiError.badRequest(`user not found`));
      if(!order)return next(ApiError.badRequest(`body is required`));

      const user = await User.findOne({ where: { id } });
      if(!user)return next(ApiError.badRequest(`user not found`));
      const fieldsToConvert = [
        'photo1', 'photo2', 'photo3', 'photo4', 'photo5', 'photo6',
        'xray', 'ctScan', 'scan1', 'scan2'
      ];
  
      fieldsToConvert.forEach(field => {
        if (order[field] && typeof order[field] === 'object') {
          order[field] = JSON.stringify(order[field]);
        }
      });


      const createOrder = await Order.create({...order, user_id: id, status_id: 1})
      if(!createOrder) return next(ApiError.badRequest("order not created"))
      return res.json({ message: "order success created" });
    } catch (err) {
      console.log(err)
      return next(ApiError.internal(`Error adding letter: ${err.message}`));
    }
  }
  async getAll(req, res, next) {
    try {
      const { id, role } = req.user;
      const { sortOrder = 'desc' } = req.query; // Default to 'desc' if not provided

      if (!id) return next(ApiError.badRequest(`User not found`));

      const user = await User.findOne({ where: { id } });
      if (!user) return next(ApiError.badRequest(`User not found`));

      let getOrders;

      const orderOptions = {
        attributes: ['id', 'age', 'firstName', 'lastName', 'gender', 'photo1', 'status_id',"createdAt"],
        include: {
          model: Status,
        },
        order: [['createdAt', sortOrder]] // Use the sortOrder parameter
      };

      if (role === "admin") {
        getOrders = await Order.findAll(orderOptions);
      } else if (role === "user") {
        getOrders = await Order.findAll({
          ...orderOptions,
          where: { user_id: id }
        });
      } else {
        getOrders = [];
      }

      if (!getOrders || getOrders.length === 0) {
        return res.json({ orders: [] });
      }

      const formattedOrders = getOrders.map(order => ({
        id: order.id,
        age: order.age,
        firstName: order.firstName,
        lastName: order.lastName,
        gender: order.gender,
        status: order?.status?.status_text || 'Unknown',
        photo1: order.photo1, 
        created_at: order.createdAt

      }));

      return res.json({ orders: formattedOrders });
    } catch (err) {
      console.log(err);
      return next(ApiError.internal(`Error retrieving orders: ${err.message}`));
    }
  }


  async getOrder(req, res, next) {
    try {
      const { id, role } = req.user;
      const { orderId } = req.params;
      if (!id) return next(ApiError.badRequest(`User not found`));
      if (!orderId) return next(ApiError.badRequest(`Order ID is required`));

      const user = await User.findOne({ where: { id } });
      if (!user) return next(ApiError.badRequest(`User not found`));

      const orderQueryOptions = {
        where: { id: orderId },
        include: [{
          model: Status,
          attributes: ['status_text']
        }]
      };

      if (role === "admin") {
        orderQueryOptions.include.push({
          model: User,
          attributes: ['id', 'email', 'full_name', 'phone', 'country', 'state', 'city', 'zip_code',"avatar"]
        });
      } else {
        orderQueryOptions.where.user_id = id;
      }

      const order = await Order.findOne(orderQueryOptions);
      if (!order) return next(ApiError.notFound(`Order not found`));

      const response = {
        ...order.dataValues,
        status: order.status ? order.status.status_text : 'Unknown',
        user: order.user ? {
          ...order.user.dataValues,
          password: undefined // Ensure password is excluded
        } : null
      };

      return res.json({ order: response });
    } catch (err) {
      return next(ApiError.internal(`Error fetching order: ${err.message}`));
    }
  }
  async getPresignedUrls(req, res, next) {
    try {
      const { fileKeys } = req.body;
      if (!fileKeys || fileKeys.length === 0) {
        return next(ApiError.badRequest("No file keys provided"));
      }

      const presignedUrls = fileKeys.map(key => {
        return S3.getSignedUrl('getObject', {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: key,
          Expires: 60 * 5 // URL valid for 5 minutes
        });
      });

      return res.json({ urls: presignedUrls });
    } catch (err) {
      return next(ApiError.internal(`Error generating presigned URLs: ${err.message}`));
    }
  }
}

module.exports = new OrderController();
