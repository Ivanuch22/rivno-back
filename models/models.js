const sequelize = require("../db/db");

const { DataTypes } = require("sequelize");


const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  avatar: { type: DataTypes.STRING },
  full_name: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  country: { type: DataTypes.STRING },
  state: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },
  zip_code: { type: DataTypes.STRING },
  secret_question: { type: DataTypes.STRING },
  secret_answer: { type: DataTypes.STRING },
  alternate_email: { type: DataTypes.STRING },
  alternate_phone: { type: DataTypes.STRING },
  googleId: { type: DataTypes.STRING },
  stripe_customer_id: { type: DataTypes.STRING, allowNull: true }

});
const Token = sequelize.define("token", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER },
  refreshToken: { type: DataTypes.STRING }
})
const Site = sequelize.define('user_site', {
  site_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER },
  link: { type: DataTypes.STRING, allowNull: false },
  key: { type: DataTypes.STRING, allowNull: true }
});

const Status = sequelize.define('status', {
  status_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  status_text: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'status',
});


const Plan = sequelize.define('plan', {
  plan_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price_mo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  price_y: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  messages_count: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  sites_count: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  plan_features: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  plan_description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  stripe_id_mo: {
    type: DataTypes.STRING,
    unique: true
  }, 
  stripe_id_y: {
    type: DataTypes.STRING,
    unique: true
  }
}, {
  tableName: 'plans',
});

const LetterArchive = sequelize.define('LetterArchive', {
  letter_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  body: { type: DataTypes.TEXT, allowNull: false },
  status_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  site_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'LetterArchive',
  timestamps: true,
});

const Subscription = sequelize.define("subscription", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  start_date: { type: DataTypes.DATE, allowNull: false },
  end_date: { type: DataTypes.DATE, allowNull: false },
  sites_limit: { type: DataTypes.INTEGER, defaultValue: 1 },
  messages_limit: { type: DataTypes.INTEGER, defaultValue: 5 },
  stripe_subscription_id: {
    type: DataTypes.STRING, // Впевніться, що тип даних відповідає рядку
    allowNull: false, // Це поле може бути порожнім або заповненим
  },
}, {
  tableName: "subscription",
  timestamps: true,

});

const Addon = sequelize.define("addon", {
  addon_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  stripe_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  messages_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sites_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  plan_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: "addon",
  timestamps: true,
});


const UserInvoice = sequelize.define("user_invoice", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  invoice_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, { tableName: "user_invoice" });


const Ticket = sequelize.define("ticket", {
  ticket_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Open",
  },
  admin_response: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  admin_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
});

Plan.hasMany(Addon, {
  foreignKey: 'plan_id', // Ключ для зв'язку
  as: 'addons', // Альтернативне ім'я для асоціації
});

// У моделі Addon
Addon.belongsTo(Plan, {
  foreignKey: 'plan_id', // Ключ для зв'язку
  as: 'plan', // Альтернативне ім'я для асоціації
});

User.hasMany(Ticket, { foreignKey: "user_id" });
Ticket.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(UserInvoice, { foreignKey: "user_id" });
UserInvoice.belongsTo(User, { foreignKey: "user_id" });

User.hasOne(Subscription, { foreignKey: "user_id" });
Subscription.belongsTo(User, { foreignKey: "user_id" });


User.hasMany(Site, { foreignKey: 'user_id' });
Site.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(Token, { foreignKey: 'userId' });
Token.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(LetterArchive, { foreignKey: 'user_id' });
LetterArchive.belongsTo(User, { foreignKey: 'user_id' });

Status.hasMany(LetterArchive, { foreignKey: 'status_id' });
LetterArchive.belongsTo(Status, { foreignKey: 'status_id' });

Site.hasMany(LetterArchive, { foreignKey: 'site_id' });
LetterArchive.belongsTo(Site, { foreignKey: 'site_id' });



module.exports = {
  User,
  Token,
  Site,
  Status,
  Plan,
  LetterArchive,
  Subscription,
  Addon,
  UserInvoice,
  Ticket
};

