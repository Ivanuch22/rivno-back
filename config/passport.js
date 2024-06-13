const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const sendVerification = require("../helpers/sendVerification");
const generateJWT = require("../helpers/generateJWT")
const { User } = require("../models/models");


module.exports = function (passport) {
  passport.use(
    new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          email: profile.emails[0].value,
          full_name: profile.displayName,
          avatar: profile.photos[0].value,
        };
        try {
          let user = await User.findOne({ where: { email: newUser.email } });
          if (!user) {
            const password = crypto.randomBytes(16).toString('hex');
            const hashPassword = await bcrypt.hash(password, 5);
            let createUser = await User.create({
              email: newUser.email,
              full_name: newUser.full_name,
              avatar: newUser.avatar,
              password: hashPassword
            });
            const tokens = await generateJWT.tokens(createUser.dataValues.id, createUser.dataValues.email);
            await sendVerification(createUser.dataValues.email, tokens.access, password);
            done(null, createUser.dataValues);

          } else {
            user = user.toJSON();
            delete user.password;
            done(null, user);
          }
        } catch (err) {
          done(err);  
        }
      }
    )
  );
  passport.use(
    new LinkedInStrategy({
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: '/api/auth/linkedin/callback',
      scope: ['r_liteprofile', 'r_emailaddress'], // Достатній обсяг дозволів
    },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile,"alsd;kfjsadljk")
        const newUser = {
          email: profile.emails[0].value,
          full_name: profile.displayName,
          avatar: profile.photos[0].value,
        };

        try {
          let user = await User.findOne({ where: { email: newUser.email } });
          if (!user) {
            const password = crypto.randomBytes(16).toString('hex');
            const hashPassword = await bcrypt.hash(password, 5);
            const createdUser = await User.create({
              email: newUser.email,
              full_name: newUser.full_name,
              avatar: newUser.avatar,
              password: hashPassword,
            });

            const tokens = await generateJWT.tokens(createdUser.id, createdUser.email);
            await sendVerification(createdUser.email, tokens.access, password);

            done(null, createdUser.dataValues);

          } else {
            user = user.toJSON();
            delete user.password;
            done(null, user);
          }
        } catch (err) {
          console.log(err, "sald;fjk")
          done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then(user => {
        if (user) {
          user = user.toJSON();
          delete user.password;
        }
        done(null, user);
      })
      .catch(err => {
        done(err);
      });
  });
}
