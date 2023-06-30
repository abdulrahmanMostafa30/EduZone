const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");
const userController = require("../controller/user");
const AppError = require("../utils/appError");
const extractFile = require("../middleware/file");



router.post(
  "/signup",
  extractFile,
  authController.signup
);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  extractFile,
  userController.updateMe
);
router.delete("/deleteMe", userController.deleteMe);


router.use(authController.restrictTo('admin'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;