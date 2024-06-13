const Router = require("express");
const router = new Router();

const letterController = require("../controlers/letterController");
const { checkSubscription, checkSiteLimit, checkMessageLimit } = require("../middleware/checkSubscription");
const authMiddleWare = require("../middleware/authMiddleware");

router.get("/user-letters", authMiddleWare, letterController.getUserLetters);
router.get("/user-letters/status/:status_id", authMiddleWare, letterController.getLettersByStatus);
router.get("/user-letters/timeframe/:period", authMiddleWare, letterController.getLettersByTimeframe);
router.post("/add", authMiddleWare, checkSubscription, checkMessageLimit, letterController.add);
router.put("/change-status", authMiddleWare, letterController.changeStatus);
router.delete("/delete", authMiddleWare, letterController.delete);

module.exports = router;
