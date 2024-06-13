const fs = require("fs");
const path = require("path");
const { Plan, UserInvoice, User, Addon, Subscription } = require("../models/models");

const CreateSubscription = require("../helpers/createSubscription");
const ApiError = require("../error/AppiError");
const { Op } = require('sequelize');
const { send } = require('../services/emailService')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);



class StripeController {
  async createCheckoutSession(req, res, next) {
    const { id, email } = req.user;
    const { planId, addonIds,subType } = req.body;

    if (!planId || !addonIds) return next(ApiError.badRequest(`planId and addonIds is required`));
    if (!subType) return next(ApiError.badRequest(`subType and addonIds is required`));
    try {
      const user = await User.findByPk(id);
      let stripeCustomerId = user.stripe_customer_id;
      if (addonIds == null) return next(ApiError.badRequest("Put addonIds array [] "));

      if (!stripeCustomerId) {
        const stripeCustomer = await stripe.customers.create({
          email: email,
        });

        await User.update(
          { stripe_customer_id: stripeCustomer.id },
          { where: { id: id } }
        );

        stripeCustomerId = stripeCustomer.id;

      }

      if (!planId) return next(ApiError.badRequest("Put plan id "));

      const plan = await Plan.findOne({
        where: {
          plan_id: planId,
        },
      })

      let lineItems = [];
      if(subType === "month"){
        lineItems.push(
          {
            price: plan.stripe_id_mo,
            quantity: 1,
          })
      }else if(subType === "year"){
        lineItems.push(
          {
            price: plan.stripe_id_y,
            quantity: 1,
          })
      }else{
      return next(ApiError.badRequest("Enter correct subType (month or year)"));
      }

      if (addonIds.length !== 0) {
        const addons = await Addon.findAll({
          where: {
            addon_id: {
              [Op.in]: addonIds,
            },
          },
        });

        addons.forEach(addon => {
          lineItems.push({
            price: addon.stripe_id,
            quantity: 1,
          })
        })
      }

      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        line_items: lineItems,
        mode: 'subscription',
        success_url: `${process.env.SERVER_URL}/api/stripe/success`,
        cancel_url: `${process.env.SERVER_URL}/api/stripe/cancel?canceled=true`,
      });
      res.json({ url: session.url })

    } catch (error) {
      return next(ApiError.internal(error.message));
    }

  }
  async successPage(req, res, next) {
    const filePath = path.join(__dirname, "../views/stripeSuccess.html");
    const htmlContent = fs.readFileSync(filePath, "utf-8");
    return res.send(htmlContent);
  }


  async pricePage(req, res) {
    const filePath = path.join(__dirname, "../views/products.html");
    const htmlContent = fs.readFileSync(filePath, "utf-8");
    res.send(htmlContent);
  }

  async cancelPage(req, res) {
    const filePath = path.join(__dirname, "../views/stripeCancel.html");
    const htmlContent = fs.readFileSync(filePath, "utf-8");
    res.send(htmlContent);
  }


  async webhook(request, response, next) {
    const sig = request.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        sig,
        process.env.STRIPE_SECRET_WEBHOOK
      );
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return next(ApiError.badRequest(err.message));
    }

    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      case 'customer.subscription.paused':
        await handleSubscriptionPaused(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionPaused(event.data.object);
        break;
      
      case 'checkout.session.completed':
       await handleSubscriptionCompleted(event.data.object)
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}.`);
    }
    response.send();
  }



}


module.exports = new StripeController();

async function handleSubscriptionCreated(subscription) {

  try {
    const user = await User.findOne({ where: { stripe_customer_id: subscription.customer } });

    if (!user) {
      console.error("User not found for subscription:", subscription.id);
      throw new Error("User not found for subscription");
    }
    console.log(subscription,999)

    let plan ;
    if(subscription.items.data[0].plan.interval === "month"){
      plan = await Plan.findOne({ where: { stripe_id_mo: subscription.items.data[0].plan.id } });
    }else if(subscription.items.data[0].plan.interval === "year"){
      plan = await Plan.findOne({ where: { stripe_id_y: subscription.items.data[0].plan.id } });
    }

    if (!plan) {
      console.error("Plan not found for subscription:", subscription.id);
      throw new Error("Plan not found for subscription");
    }

    // Обчислюємо загальну кількість сайтів та повідомлень з урахуванням доповнень (addons)
    let totalSites = plan.sites_count;
    let totalMessages = plan.messages_count;


    const objectSubscription = {
      user_id: user.id,
      start_date: new Date(subscription.current_period_start * 1000),
      end_date: new Date(subscription.current_period_end * 1000),
      sites_limit: totalSites,
      messages_limit: totalMessages,
      stripe_subscription_id: subscription.id
    };
    const newSubscription = await CreateSubscription(objectSubscription);

    console.log("New subscription created:", newSubscription);

    const emailBody = `Дорогий ${user.full_name}, ваша підписка успішно створена!`;
    await send(user.email, "Успішне створення підписки", emailBody);


    return newSubscription;
  } catch (error) {
    console.error("Error handling subscription created event:", error);
    throw error;
  }
}


async function handleSubscriptionPaused(subscription) {
  try {

    const user = await User.findOne({ where: { stripe_customer_id: subscription.customer } });

    if (!user) {
      console.error("User not found for subscription:", subscription.id);
      throw new Error("User not found for subscription");
    }
    console.log(subscription,444)

    let plan ;
    if(subscription.items.data[0].plan.interval === "month"){
      plan = await Plan.findOne({ where: { stripe_id_mo: subscription.items.data[0].plan.id } });
    }else if(subscription.items.data[0].plan.interval === "year"){
      plan = await Plan.findOne({ where: { stripe_id_y: subscription.items.data[0].plan.id } });
    }

    if (!plan) {
      console.error("Plan not found for subscription:", subscription.id);
      throw new Error("Plan not found for subscription");
    }


    let totalSites = plan.sites_count;
    let totalMessages = plan.messages_count;


    const updatedSubscription = await Subscription.update({
      start_date: new Date(subscription.current_period_start * 1000),
      end_date: new Date(subscription.current_period_end * 1000),
      sites_limit: totalSites,
      messages_limit: totalMessages,
    }, { where: { stripe_subscription_id: subscription.id } });

    console.log("Subscription paused:", updatedSubscription);

    const emailBody = `Дорогий ${user.full_name}, ваша підписка була призупинена. Для відновлення зв'яжіться зі службою підтримки.`;
    await send(user.email, "Призупинення підписки", emailBody);

    return updatedSubscription;
  } catch (error) {
    console.error("Error handling subscription paused event:", error);
    throw error;
  }
}


async function handleSubscriptionUpdated(subscription) {
  try {
    const user = await User.findOne({ where: { stripe_customer_id: subscription.customer } });

    if (!user) {
      console.error("User not found for subscription:", subscription.id);
      throw new Error("User not found for subscription");
    }
    console.log(subscription,333)


    let plan ;
    if(subscription.items.data[0].plan.interval === "month"){
      plan = await Plan.findOne({ where: { stripe_id_mo: subscription.items.data[0].plan.id } });
    }else if(subscription.items.data[0].plan.interval === "year"){
      plan = await Plan.findOne({ where: { stripe_id_y: subscription.items.data[0].plan.id } });
    }
    
    if (!plan) {
      console.error("Plan not found for subscription:", subscription.id);
      throw new Error("Plan not found for subscription");
    }

    let totalSites = plan.sites_count;
    let totalMessages = plan.messages_count;



    const updatedSubscription = await Subscription.update({
      start_date: new Date(subscription.current_period_start * 1000),
      end_date: new Date(subscription.current_period_end * 1000),
      sites_limit: totalSites,
      messages_limit: totalMessages,
    }, { where: { stripe_subscription_id: subscription.id } });

    console.log("Subscription updated:", updatedSubscription);

    const emailBody = `Дорогий ${user.full_name}, ваша підписка успішно оновлена!`;
    await send(user.email, "Успішне створення підписки", emailBody);

    return updatedSubscription;
  } catch (error) {
    console.error("Error handling subscription updated event:", error);
    throw error;
  }
}
async function handleSubscriptionCompleted(subscription){
  const session = subscription;
  let lineItems;
  try {
    const data = await stripe.checkout.sessions.listLineItems(session.id);
    lineItems = data
  } catch (error) {
    console.error("Error fetching line items:", error);
  }

    let priceIds = [];
    const user = await User.findOne({ where: { stripe_customer_id: session.customer } })

    if (!user) return next(ApiError.badRequest("user not found"))

    if (lineItems.data && lineItems.data.length > 0) {
      priceIds = lineItems.data.map((item) => item.price.id);
    }

    let matchedPlans = [];
    let matchedAddons = [];

    await Promise.all(
      priceIds.map(async (priceId) => {
        const matchedPlan = await Plan.findOne({
          where: {
            [Op.or]: [
              { stripe_id_mo: priceId },
              { stripe_id_y: priceId }
            ]
          }
        });
        if (matchedPlan) {
          matchedPlans.push(matchedPlan);
        }
        

        const matchedAddon = await Addon.findOne({ where: { stripe_id: priceId } });
        if (matchedAddon) {
          matchedAddons.push(matchedAddon);
        }
      })
    );

    const totalMessagesFromPlans = matchedPlans.reduce(
      (total, plan) => total + (plan.messages_count || 0),
      0
    );

    const totalSitesFromPlans = matchedPlans.reduce(
      (total, plan) => total + (plan.sites_count || 0),
      0
    );

    // Обчислення сум значень `messages_count` та `sites_count` у аддонах
    const totalMessagesFromAddons = matchedAddons.reduce(
      (total, addon) => total + (addon.messages_count || 0),
      0
    );

    const totalSitesFromAddons = matchedAddons.reduce(
      (total, addon) => total + (addon.sites_count || 0),
      0
    );

    // Загальні значення
    const totalMessages = totalMessagesFromPlans + totalMessagesFromAddons;
    const totalSites = totalSitesFromPlans + totalSitesFromAddons;



    if (matchedPlans.length > 0) {
      const newSubscription = {
        user_id: user.id,
        start_date: new Date(session.created *1000),
        end_date: new Date(session.expires_at*1000),
        sites_limit: totalSites,
        messages_limit: totalMessages,
        stripe_subscription_id: session.subscription
      };
      console.log(session,newSubscription,124)
      const newSubscriptios = await CreateSubscription(newSubscription);
      const userInvoice = await UserInvoice.create({
        user_id: user.id,
        invoice_id: session.invoice
      })
    }
}

