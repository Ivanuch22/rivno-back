
const Router = require('express');
const router = new Router();
const subscriptionController = require('../controlers/subscriptionController');
const authMiddleWare = require("../middleware/authMiddleware");

router.get("/invoices-list",authMiddleWare, subscriptionController.getUserInvoices );
router.post('/invoice-download', authMiddleWare, subscriptionController.downloadInvoice);
router.get('/delete-subscription', authMiddleWare, subscriptionController.cancelSubscription);
router.get('/retrieve-subscription', authMiddleWare, subscriptionController.getSubStatus);



module.exports = router;
