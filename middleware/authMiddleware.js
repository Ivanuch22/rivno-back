const jwt = require("jsonwebtoken");
const ApiError = require("../error/AppiError");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const authorizationHeader = req.headers.authorization;
    console.log(authorizationHeader)
    if (!authorizationHeader) {
      return next(ApiError.unauthorized("Authorization header not found"));
    }

    const [scheme, token] = authorizationHeader.split(" ");

    if (scheme !== "Bearer") {
      return next(ApiError.unauthorized("Invalid authorization scheme"));
    }

    if (!token) {
      return next(ApiError.unauthorized("Token not found"));
    }
    console.log(token,"token")
    const decoded = jwt.verify(token, process.env.SECRET_KEY_ACESS);

    if (!decoded) {
      return next(ApiError.unauthorized("Invalid token"));
    }
    req.user = decoded;
    next();

  } catch (e) {
    console.error("JWT verification error:", e);

    if (e.name === "TokenExpiredError") {
      return next(ApiError.unauthorized("Token has expired"));
    }

    if (e.name === "JsonWebTokenError") {
      return next(ApiError.unauthorized("Malformed token"));
    }

    return next(ApiError.internal("Internal server error"));
  }
};
