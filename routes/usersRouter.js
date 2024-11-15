const Router = require("express");
const router = new Router();

const userController = require("../controlers/userController");
const authMiddleWare = require("../middleware/authMiddleware");
const tokenMiddleware = require("../middleware/tokenMiddleware")

router.get('/auth',authMiddleWare, userController.auth);
router.get("/verify-email", tokenMiddleware,  userController.verifyEmail);
router.get('/refresh-token', userController.refreshToken);
router.get("/pass-reset", tokenMiddleware, userController.getResetPassword);
router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.post("/forgot-password",  userController.forgotPassword);
router.post("/reset-password",authMiddleWare, userController.resetPassword);
router.post("/send-verification",authMiddleWare,  userController.sendVerificatoin);
router.put('/update-profile', authMiddleWare, userController.updateProfile);


module.exports = router;