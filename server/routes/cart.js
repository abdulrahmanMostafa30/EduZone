const express = require("express");
const router = express.Router();
const cartController = require("../controller/cart");
const authController = require("../controller/auth");

router.use(authController.protect);

router.get("", cartController.getItems);

router.post("", cartController.add);
router.delete("/:cartItemId", cartController.remove);

module.exports = router;

