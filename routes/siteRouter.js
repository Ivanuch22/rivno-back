const Router = require("express");
const router = new Router();

const siteController = require("../controlers/siteController");
const { checkSubscription, checkSiteLimit } = require("../middleware/checkSubscription");
const authMiddleWare = require("../middleware/authMiddleware");

router.get("/list",authMiddleWare,  siteController.list);
router.post("/add", authMiddleWare , checkSubscription, checkSiteLimit ,siteController.add);
router.put("/change",authMiddleWare, siteController.change);
router.put("/regenerage-key",authMiddleWare,  siteController.regenerateKey);
router.delete("/delete",authMiddleWare,  siteController.delete);

module.exports = router;


