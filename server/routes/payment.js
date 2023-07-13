const express = require("express");
const router = express.Router();
const paymentController = require("../controller/payment");
const authController = require("../controller/auth");

router.use(authController.protect);


router.post("/paypal/create-payment", paymentController.paypalCreatePayment);
router.get("/paypal/capture-payment", paymentController.paypalExecutePayment);


router.post("/stripe/create-payment", paymentController.stripeCreatePayment);
router.post("/stripe/complete-payment", paymentController.stripeCompletePayment);

module.exports = router;

