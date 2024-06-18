const Router = require("express");
const router = new Router();

const AwsControll = require("../controlers/awsContoller");
const authMiddleWare = require("../middleware/authMiddleware");

router.get("/all", authMiddleWare, AwsControll.getAll);
router.post("/upload", authMiddleWare, AwsControll.uploadFile);



module.exports = router;


