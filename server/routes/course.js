const express = require("express");
const router = express.Router();
const courseController = require("../controller/course");
const authController = require('./../controller/auth');

router
  .route("")
  .get(courseController.getAllCourses)
  .post(authController.protect, authController.restrictTo('admin'), courseController.addCourse);

router
  .route("/:id")
  .get(courseController.getCourseById)
  .delete(authController.protect, authController.restrictTo('admin'), courseController.delelteCourseById)
  .put(authController.protect, authController.restrictTo('admin'), courseController.updateCourse);

module.exports = router;

