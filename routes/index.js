const Router = require("express");
const router = new Router();

const usersRouter = require("./usersRouter");
const siteRouter = require("./siteRouter");
const googleRouter = require("./googleAuthRouter");
const statusRouter = require("./statusRouter");
const planRouter = require("./planRouter");
const letterRouter = require("./letterRouter");
const stripeRouter = require('./stripeRouter');
const subscriptionRouter = require('./subscriptionRouter');
const tiketRouter = require('./tiketsRouter');
const addonRouter = require('./addonRouter');

router.use("/users", usersRouter);
router.use("/sites", siteRouter);
router.use("/auth",googleRouter );
router.use("/status",statusRouter );
router.use("/plan",planRouter );
router.use("/letter",letterRouter );
router.use('/stripe', stripeRouter);
router.use('/subscription', subscriptionRouter);
router.use('/tikets', tiketRouter);
router.use('/addons', addonRouter);


module.exports = router;
