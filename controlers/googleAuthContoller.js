const generateJWT = require("../helpers/generateJWT")
const ApiError = require("../error/AppiError");


class googleAuthContoller {
  async callback (req, res){
    const user = req.user;
    if(!user)return next(ApiError.badRequest(`User not found`));
    const tokens = await generateJWT.tokens(user.id, user.email);
    await generateJWT.saveRefreshToken(user.id, tokens.refresh);
    return res.json({ status: 200,tokens});
  }
  async loginPage (req, res) {
    res.render('login')  
  }
  async linkedinCallback(req, res) {
    const user = req.user;
    if(!user)return next(ApiError.badRequest(`User not found`));
    const tokens = await generateJWT.tokens(user.id, user.email);
    await generateJWT.saveRefreshToken(user.id, tokens.refresh);
    return res.json({ status: 200,tokens});
  }
} 

module.exports = new googleAuthContoller();


