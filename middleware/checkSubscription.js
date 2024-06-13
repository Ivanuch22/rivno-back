const { Subscription, Site, LetterArchive } = require("../models/models");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const isSubscriptionActive = async (user_id) => {
  const subscription = await Subscription.findOne({ where: { user_id } });
  
  if (!subscription || !subscription.stripe_subscription_id) {
    return false;
  }

  try {
    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id);
    console.log(stripeSubscription.status)
    if (!stripeSubscription || stripeSubscription.status !== 'active') {
      return false; 
    }

    const now = new Date();
    const currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000); // Період у мілісекундах

    return stripeSubscription.status === 'active' && currentPeriodEnd >= now;
  } catch (error) {
    console.error("Error checking Stripe subscription:", error);
    return false; 
  }
};


const checkSubscription = async (req, res, next) => {
  const { id } = req.user;
  console.log(id)
  const isActive = await isSubscriptionActive(id);
  if (!isActive) {
    return res.status(403).json({ error: "Subscription is not active or not found" });
  }
  next();
};

const checkSiteLimit = async (req, res, next) => {
  const { id } = req.user;
  const subscription = await Subscription.findOne({ where: { user_id:id } });

  const sitesCount = await Site.count({ where: { user_id:id } });

  const totalSitesAllowed = subscription.sites_limit;

  if (sitesCount >= totalSitesAllowed) {
    return res.status(403).json({ error: "Site limit reached" });
  }

  next();
};

const checkMessageLimit = async (req, res, next) => {
  const {id} = req.user
  const { site_id } = req.body;
  const site = await Site.findOne({ where: { site_id } });

  if (!site) {
    return res.status(404).json({ error: "Site not found" });
  }

  const subscription = await Subscription.findOne({ where: { user_id: id } });


  const messageCount = await LetterArchive.count({ where: { site_id } });

  const totalMessagesAllowed = subscription.messages_limit;

  if (messageCount >= totalMessagesAllowed) {
    return res.status(403).json({ error: "LetterArchive limit reached" });
  }

  next();
};

module.exports = { checkSubscription, checkSiteLimit, checkMessageLimit };
