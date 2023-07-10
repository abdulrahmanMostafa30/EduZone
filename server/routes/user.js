const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");
const userController = require("../controller/user");
const AppError = require("../utils/appError");
const {convertUrlToImage, extractFile} = require("../middleware/file");

router.post("/signup", convertUrlToImage, extractFile, authController.signup);
router.post("/login", authController.login);

// router.post("/uploud-image-google", extractFile, authController.convertUrlToImage);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.use(authController.protect);

router.patch("/updateMyPassword", authController.updatePassword);
router.get("/me", userController.getMe, userController.getUser);
router.patch("/updateMe", extractFile, userController.updateMe);
router.delete("/deleteMe", userController.deleteMe);

router.use(authController.restrictTo("admin"));
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router.get(
  "/:id/courses",
  authController.protect,
  authController.restrictTo("admin"),
  userController.getUserCourses
);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
