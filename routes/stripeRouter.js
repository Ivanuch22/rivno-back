const Router = require('express');
const router = new Router();
const stripeController = require('../controlers/stripeController');
const authMiddleWare = require("../middleware/authMiddleware");

router.get("/products",stripeController.pricePage);
router.get("/success",stripeController.successPage);
router.get("/cancel",stripeController.cancelPage);

router.post('/create-checkout-session',authMiddleWare, stripeController.createCheckoutSession);


module.exports = router;
