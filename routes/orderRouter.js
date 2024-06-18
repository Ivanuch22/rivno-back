const Router = require("express");
const router = new Router();

const OrderController = require("../controlers/orderController");
const authMiddleWare = require("../middleware/authMiddleware");




router.get("/all", authMiddleWare, OrderController.getAll);
router.post("/create", authMiddleWare, OrderController.create);



module.exports = router;


