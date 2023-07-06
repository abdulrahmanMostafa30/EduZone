const express = require("express");
const router = express.Router();
const purchaseController = require("../controller/purchase");
const authController = require("../controller/auth");

router.use(authController.protect);
router.post("/course", purchaseController.purchaseCourse);

module.exports = router;

