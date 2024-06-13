const jwt = require("jsonwebtoken");
const ApiError = require("../error/AppiError");


module.exports  = (req, res, next) => {
    try {
      const token = req.query.token; 
      if (!token) {
        return next(ApiError.unauthorized("Token is missing"));
      }
  
      const decoded = jwt.verify(token, process.env.SECRET_KEY_ACESS);
      req.user = decoded; 
      next(); 
    } catch (e) {
      return next(ApiError.unauthorized("Invalid token"));
    }
  };