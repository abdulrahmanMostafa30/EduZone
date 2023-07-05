const express = require("express");
const router = express.Router();
const contactController = require("../controller/contact");
const authController = require("../controller/auth");

router.post("", contactController.add);
router.use(authController.protect, authController.restrictTo("admin"));
router.get("", contactController.getItems);
router.delete("/:contactId", contactController.remove);

module.exports = router;

