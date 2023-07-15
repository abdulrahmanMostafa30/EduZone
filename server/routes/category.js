const express = require("express");
const router = express.Router();
const categoryController = require("../controller/category");
const authController = require("./../controller/auth");

router.get("/", categoryController.getCategories);
router.post(
  "/",
  authController.protect,
  authController.restrictTo("admin"),
  categoryController.createCategory
);

// Route for deleting a category
router.delete(
  "/:id",
  authController.protect,
  authController.restrictTo("admin"),
  categoryController.deleteCategory
);
module.exports = router;
