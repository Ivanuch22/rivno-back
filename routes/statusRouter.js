const Router = require("express");
const router = new Router();

const statusController = require("../controlers/statusController");
const authMiddleWare = require("../middleware/authMiddleware");

router.get("/list",authMiddleWare,  statusController.list);
router.post("/add", authMiddleWare,statusController.add);
router.put("/change",authMiddleWare, statusController.change);
router.delete("/delete",authMiddleWare,  statusController.delete);

module.exports = router;


