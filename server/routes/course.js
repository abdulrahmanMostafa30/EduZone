const express = require("express");
const router = express.Router();
const courseController = require("../controller/course");
const authController = require('./../controller/auth');
const extractFile = require("../middleware/file");

router
  .route("")
  .get(courseController.getAllCourses)
  .post(authController.protect, authController.restrictTo('admin'), extractFile, courseController.addCourse);

router
  .route("/:id")
  .get(courseController.getCourseById)
  .delete(authController.protect, authController.restrictTo('admin'), courseController.delelteCourseById)
  .patch(authController.protect, authController.restrictTo('admin'), extractFile, courseController.updateCourse);

module.exports = router;

