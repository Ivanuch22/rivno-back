const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const { send } = require("../services/emailService")
const sendVerification = require("../helpers/sendVerification")
const generateJWT = require("../helpers/generateJWT")
const { User, Token } = require("../models/models");
const ApiError = require("../error/AppiError");
const fs = require("fs");
const path = require("path");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'userImages');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

class UserController {
  async registration(req, res, next) {
    const { email, password, full_name, country, isSendMessage, role = 'user' } = req.body;
    if (!email || !password || !full_name) return next(ApiError.badRequest("Email, password and name are required"));
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        next(ApiError.userAlreadyExist("User with this email already exists"));
      }
      const hashedPassword = await bcrypt.hash(password, 5);
      const newUser = await User.create({
        email, full_name, country, isSendMessage, password: hashedPassword, role
      });
      const { access, refresh } = generateJWT.tokens(newUser.id, newUser.email);
      await generateJWT.saveRefreshToken(newUser.id, refresh);
      res.json({
        status: 200,
        access, refresh,
        user: { ...newUser.dataValues, password: undefined }
      });
    } catch (error) {
      return next(ApiError.internal("Internal Server Error", error));
    }
  }

  async verifyEmail(req, res, next) {
    try {
      const { email } = req.user
      if (!email) return next(ApiError.badRequest("Email not found"));

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return next(ApiError.badRequest("User not found"));
      }
      await user.update({ is_verified: true });
      res.json({ status: 200, message: "Email is verified" });
    } catch (error) {
      return next(ApiError.internal("Internal Server Error", error));

    }
  }


  async sendVerificatoin(req, res, next) {
    const { email } = req.user;
    try {
      if (!email) return next(ApiError.badRequest("Bad email"));
      const candidate = await User.findOne({ where: { email } });
      if (!candidate) return next(ApiError.badRequest("Bad email"));
      const token = generateJWT.acess(candidate.id, candidate.email);
      sendVerification(email, token);
      return res.json({ status: 200, message: "Message send" });
    }
    catch (error) {
      return next(ApiError.internal("Internal Server Error", error));
    }
  }


  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // if (!email) return next(ApiError.badRequest("Enter email"));
      // if (!password) return next(ApiError.badRequest("Enter password"));

      const user = await User.findOne({ where: { email } });
      if (!user) return next(ApiError.badRequest("User is not found"));

      let comparePasswordd = bcrypt.compareSync(password, user.password);
      if (!comparePasswordd) return next(ApiError.badRequest("User password incorect"));

      const token = generateJWT.tokens(user.id, user.email);
      const userWithoutPassword = { ...user.dataValues, password: undefined }; // Видаляємо пароль перед поверненням даних
      generateJWT.updateRefreshToken(user.id, token.refresh);
      return res.json({ access: token.access, refresh: token.refresh, user: userWithoutPassword });

    } catch (error) {
      return next(ApiError.internal("Internal Server Error", error));
    }

  }

  async forgotPassword(req, res, next) {
    const { email } = req.body;
    if (!email) return next(ApiError.badRequest("Enter is required"));
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) return next(ApiError.badRequest("User is not found"));
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY_ACESS, { expiresIn: '1h' });
      await send(email, 'Password Reset', `<p>Click <a href="${process.env.PUBLIC_URL}:${process.env.PORT}/api/users/pass-reset?token=${token}">here</a> to reset your password.</p>`);
      res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
      return next(ApiError.internal("Internal Server Error", error));
    }
  }

  async resetPassword(req, res, next) {
    const { newPassword } = req.body;
    const { id } = req.user
    if (!newPassword) return next(ApiError.badRequest("New Password required"));
    if (!id) return next(ApiError.badRequest("User Not Foud"));

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 5);
      const updatedUser = await User.update(
        { password: hashedPassword },
        { returning: true, where: { id } }
      );
      if (!updatedUser) return next(ApiError.badRequest("User is not found"));
      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      return next(ApiError.internal("Internal Server Error", error));
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return next(ApiError.badRequest("Refresh token not found"));
      const existingToken = await Token.findOne({ where: { refreshToken } });
      if (!existingToken) return next(ApiError.badRequest("Invalid refresh token."));
      jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH, (err, user) => {
        if (err) return next(ApiError.badRequest("Invalid refresh token."));
        const tokens = generateJWT.tokens(user.id, user.email);
        generateJWT.updateRefreshToken(user.id, tokens.refresh);
        res.json({ status: 200, tokens });
      });
    } catch (error) {
      return next(ApiError.internal("Internal Server Error", error));
    }
  }

  async auth(req, res, next) {
    const { email } = req.user
    try {
      if (!email) {
        return next(ApiError.unauthorized("No token provided"));
      }
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return next(ApiError.badRequest("User not found"));
      }
      const userWithoutPassword = { ...user.dataValues, password: undefined }; // Видаляємо пароль перед поверненням даних
      res.json({
        status: 200,
        user: userWithoutPassword,
      });
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return next(ApiError.badRequest("Invalid token"));
      }
      return next(ApiError.internal("Internal Server Error", error));
    }
  }

  async getResetPassword(req, res, next) {
    try {
      const token = req.query.token;
      const filePath = path.join(__dirname, "../views/resetPassword.html");
      const htmlContent = fs.readFileSync(filePath, "utf-8");
      const updatedHtml = htmlContent.replace("${TOKEN}", token);
      const resetUrl = `${process.env.PUBLIC_URL}:${process.env.PORT}/api/users/reset-password`;
      const finalHtml = updatedHtml.replace("http://localhost:5500/api/users/reset-password", resetUrl);
      res.send(finalHtml);
    } catch (error) {
      return next(ApiError.internal("Internal Server Error", error));
    }
  }

  async updateProfile(req, res, next) {
      const { id } = req.user;
      const {
        full_name,
        phone,
        country,
        city,
        state,
        zip_code,
        alternate_email,
        alternate_phone,
        secret_question,
        secret_answer,
      } = req.body;

      try {
        const updatedUser = await User.update(
          {
            full_name,
            phone,
            country,
            city,
            state,
            zip_code,
            alternate_email,
            alternate_phone,
            secret_question,
            secret_answer,
          },
          { where: { id: id }, returning: true, plain: true }
        );

        res.json({ message: 'Profile updated successfully', user: updatedUser[1] });
      } catch (error) {
        res.json({  message: "Profile updated failed", user: {} })
        next(error);
      }
    };

  async updateAvatar(req, res, next) {

    try {
      const { id } = req.user; // Assuming userId is available in req.user
      let avatarUrl = null;

      if (req.files && req.files.avatar) {
        const avatar = req.files.avatar;
        const avatarPath = path.join(__dirname, '../userImages', `${id}_${Date.now()}_${avatar.name}`);
        avatar.mv(avatarPath, (err) => {
          if (err) {
            return next(ApiError.internal('Failed to upload avatar', err));
          }
        });

        avatarUrl = `${process.env.PUBLIC_URL}:${process.env.PORT}/userImages/${path.basename(avatarPath)}`;
        const updatedUser = await User.update({avatar: avatarUrl },
          { where: { id }, returning: true, plain: true }
          )
        return res.json({avatarUrl, user: updatedUser[1]})
      }

    } catch (e) {
      console.log(e)
    }

  }
}

module.exports = new UserController();


