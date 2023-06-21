const express = require("express");
const router = express.Router();
const courseController = require("../Controller/courseController");

router
  .route("")
  .get(courseController.getAllCourses)
  .post(courseController.addCourse);

router
  .route("/:id")
  .get(courseController.getCourseById)
  .delete(courseController.delelteCourseById)
  .put(courseController.updateCourse);

module.exports = router;
