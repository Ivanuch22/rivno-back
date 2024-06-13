const {send} = require("../services/emailService")

module.exports = sendVerification = async (email, token,password="") => {
    let verificationLink = `${process.env.PUBLIC_URL}:${process.env.PORT}/api/users/verify-email?token=${token}`;
    password.length>0?await send(email, 'Verify Email', `<p>Click <a href=${verificationLink}>here</a> to Verify your Email.</p> <p>Your password ${password}</p> `):await send(email, 'Verify Email', `<p>Click <a href=${verificationLink}>here</a> to Verify your Email.</p>`);
  }