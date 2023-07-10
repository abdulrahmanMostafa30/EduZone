const express = require("express");
const router = express.Router();
const purchaseController = require("../controller/purchase");
const authController = require("../controller/auth");

router.use(authController.protect);


router.post("/create-payment", purchaseController.createPayment);

// Execute Payment
// router.get("/execute-payment", purchaseController.executePayment);
router.get("/capture-payment", purchaseController.executePayment);

module.exports = router;

