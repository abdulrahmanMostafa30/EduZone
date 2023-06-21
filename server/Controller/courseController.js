const CourseSchema = require("../models/courseModel");

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;


module.exports.getAllCourses = (request, response, next) => {
  CourseSchema.find({})
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

module.exports.addCourse = (request, response, next) => {
  let newObject = new CourseSchema({
    title: request.body.title,
    description: request.body.description,
    category: request.body.category,
    price: request.body.price,
    image: request.body.image,
  });
  newObject
    .save()
    .then((data) => {
      response.status(201).json({
        message: "Done",
        data: data,
      });
    })
    .catch((error) => next(error));
};

module.exports.updateCourse = (request, response, next) => {
  CourseSchema.updateOne(
    {
      _id: new ObjectId(request.params.id),
    },
    {
      $set: { title: request.body.title },
    }
  )
    .then((data) => {
      response.status(201).json({
        message: "Done",
        data: data,
      });
    })
    .catch((error) => {});
};

module.exports.getCourseById = (request, response, next) => {
  CourseSchema.findOne({ _id: new ObjectId(request.params.id) })
    .then((data) => {
      if (data == null) throw new Error("Course doesn't exists");

      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

module.exports.delelteCourseById = (request, response, next) => {
  CourseSchema.deleteOne({
    _id: new ObjectId(request.params.id),
  })
    .then((data) => {
      response.status(201).json({
        message: "Done",
        data: data,
      });
    })
    .catch((error) => next(error));
};
