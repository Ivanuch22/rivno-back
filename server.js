require("dotenv").config();
const fileUpload = require("express-fileupload");
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const passport = require('passport')//
const session = require('express-session')//
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const bodyParser = require("body-parser")
const sequelize = require("./db/db");
const models = require("./models/models");
const router = require("./routes/index");
const errorHandler = require("./middleware/ErrorHandlingMiddleware");
const specs = require('./new-swagger-output.json');
const stripeController = require('./controlers/stripeController');
const cookieParser = require("cookie-parser")
const PORT = process.env.PORT || 5500;
const HOST = process.env.HOST || "0.0.0.0";

const app = express();
const corsOptions = {
  origin: process.env.FRONT_URL,
  credentials: true,
};


require('./config/passport')(passport)

app.set('view engine','ejs');

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
      db: sequelize
    })
  })
)



app.use(passport.initialize())
app.use(passport.session());
app.post("/webhook", express.raw({ type: 'application/json' }), stripeController.webhook);

app.use(express.static('public'));
app.use('/userImages', express.static('userImages')); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser())
app.use(fileUpload({}));
app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.FRONT_URL);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use("/api", router);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));


app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate(); 
    await sequelize.sync();

    app.listen(PORT, HOST, () => {
      console.log("Server start on port", PORT);
    });
  } catch (e) {
    console.log(e);
  }
};
start();
