

const Router = require("express");
const router = new Router();
const passport = require('passport')

const googleAuthContoller = require("../controlers/googleAuthContoller")

router.get("/",googleAuthContoller.loginPage);
router.get('/google', passport.authenticate('google', { scope: ['profile','email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: 'api/auth/'}), googleAuthContoller.callback);

router.get("/linkedin", passport.authenticate("linkedin",{ scope: ['profile','email'] }));
router.get("/linkedin/callback",passport.authenticate("linkedin", { failureRedirect: "/linkedin" }),googleAuthContoller.linkedinCallback)

module.exports = router;


