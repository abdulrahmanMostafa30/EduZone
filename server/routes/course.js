const express = require("express");
const router = express.Router();
const courseController = require("../controller/course");
const authController = require("./../controller/auth");
const {extractFile} = require("../middleware/file");

router
  .route("")
  .get(authController.checkAuth, courseController.getAllCourses)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    extractFile,
    courseController.addCourse
  );
router.put(
  "/:courseId/status",
  authController.protect,
  authController.restrictTo("admin"),
  courseController.updateCourseStatus
);

router
  .route("/my-courses")
  .get(authController.protect, courseController.getPurchasedCourses);

router
  .route("/comment")
  .post(authController.protect, courseController.addComment);

router
  .route("/:id")
  .get(courseController.getCourseById)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    courseController.delelteCourseById
  )
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    extractFile,
    courseController.updateCourse
  );


module.exports = router;
