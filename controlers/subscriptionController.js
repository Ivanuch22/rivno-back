const { UserInvoice,Subscription } = require("../models/models");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const ApiError = require("../error/AppiError");

class StripeController {
  async getUserInvoices(req, res, next) {
    const { id } = req.user;

    try {
      const userInvoices = await UserInvoice.findAll({
        where: { user_id: id },
      });

      if (!userInvoices || userInvoices.length === 0) {
        return next(ApiError.badRequest("Invoices not found for this user"));
      }

      const invoiceIds = userInvoices.map((ui) => ui.invoice_id);

      const invoices = await Promise.all(
        invoiceIds.map((invoiceId) => stripe.invoices.retrieve(invoiceId))
      );

      return res.status(200).json({ invoices });
    } catch (err) {
      console.error("Error fetching invoices:", err);
      return next(ApiError.internal("Error fetching invoices"));
    }
  }

  async downloadInvoice(req, res, next) {
    const { invoiceId } = req.body;
    
    if(!invoiceId)return next(ApiError.badRequest("invoiceId is required"))
    try {
      const userInvoice = await UserInvoice.findOne({
        where: { invoice_id: invoiceId },
      });

      if (!userInvoice) {
        return next(ApiError.badRequest("Invoice not found"));
      }

      const invoice = await stripe.invoices.retrieve(invoiceId);

      if (invoice.hosted_invoice_url) {
        return res.json({url: invoice.hosted_invoice_url});
      } else {
        return next(ApiError.badRequest("Hosted Invoice URL not available"));
      }
    } catch (err) {
      console.error("Error retrieving invoice:", err);
      return next(ApiError.internal("Error retrieving invoice"));
    }
  }
  async cancelSubscription(req, res, next) {
    const { id} = req.user;

    try {
      console.log("sub is deleted")
      const subscription = await Subscription.findOne({ where: { user_id:id } });
      const subscriptionId  = subscription.stripe_subscription_id

      const canceledSubscription = await stripe.subscriptions.cancel(subscriptionId);
      await subscription.update({
        end_date: new Date(1 * 1000),
      })


      res.json({ success: true, message: 'Subscription canceled successfully' });
    } catch (error) {
      // Обробіть помилку, якщо щось пішло не так
      console.error('Error canceling subscription:', error);
      return next(ApiError.internal('Error canceling subscription'));
    }
  }
  async getSubStatus (req,res,next){
    const { id} = req.user;
    try {
      console.log("sub is deleted")
      const subscription = await Subscription.findOne({ where: { user_id:id } });
      if(!subscription)return next(ApiError.badRequest("Subscription not found"))
      const subscriptionId  = subscription.stripe_subscription_id
      const retrieved = await stripe.subscriptions.retrieve(subscriptionId);
      if(!retrieved)return next(ApiError.badRequest("Subscription in stripe not found"))

      await subscription.update({
        start_date: new Date(retrieved.current_period_start * 1000),
        end_date: new Date(retrieved.current_period_end * 1000),
      })

      res.json({status: retrieved.status });
    } catch (error) {
      // Обробіть помилку, якщо щось пішло не так
      console.error('Error canceling subscription:', error);
      return next(ApiError.internal('Error canceling subscription'));
    }
  }

}

module.exports = new StripeController();
