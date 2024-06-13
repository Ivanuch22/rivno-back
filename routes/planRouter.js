const Router = require("express");
const router = new Router();

const planController = require("../controlers/planController");
const authMiddleWare = require("../middleware/authMiddleware");

router.get("/list", planController.list);
router.post("/add", authMiddleWare,planController.add);
router.put("/change",authMiddleWare, planController.change);
router.delete("/delete",authMiddleWare,  planController.delete);

module.exports = router;


