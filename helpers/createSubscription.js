const { Subscription } = require('../models/models');

module.exports = CreateSubscription = async (obj) => {
    const { user_id,
        start_date,
        end_date,
        sites_limit,
        messages_limit,
        stripe_subscription_id } = obj

    const existingSubscriptions = await Subscription.findAll({ where: { user_id } });

    if (existingSubscriptions && existingSubscriptions.length > 0) {
        await Subscription.destroy({ where: { user_id } });
        const newSubscription = await Subscription.create({ user_id, start_date, end_date, sites_limit, messages_limit,stripe_subscription_id });
        return newSubscription;
    } else {
        const newSubscription = await Subscription.create({ user_id, start_date, end_date, sites_limit, messages_limit,stripe_subscription_id });
        return newSubscription;
    }
}