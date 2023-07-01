const Course = require("../models/course");
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

module.exports.getAllCourses = (request, response, next) => {
  Course.find({})
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

module.exports.addCourse = (request, response, next) => {
  console.log(request.file);
  let image = request.body.image;
  if (request.file) {
    const url = request.protocol + "://" + request.get("host");
    image = url + "/images/" + request.file.filename;
  }
  const title = request.body.title;
  const description = request.body.description;
  const category = request.body.category;
  const price = request.body.price;
  const vid = request.body.vid;
  const course = new Course({
    title: title,
    description: description,
    category: category,
    price: price,
    image: image,
    vid: vid
  });
  course
    .save()
    .then((data) => {
      response.status(201).json({
        message: "Done",
        data: data,
      });
    })
    .catch((error) => next(error));
};

module.exports.updateCourse = catchAsync(async (request, response, next) => {
  let image = request.body.image;
  if (request.file) {
    const url = request.protocol + "://" + request.get("host");
    image = url + "/images/" + request.file.filename;
  }
  
  const filteredBody = filterObj(req.body, 'title', 'description', 'category', 'price', 'vid');
  filteredBody['image'] = image

  const updatedCourse = await Course.findByIdAndUpdate(request.params.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      course: updatedCourse
    }
  });
});

module.exports.getCourseById = (request, response, next) => {
  Course.findOne({ _id: new ObjectId(request.params.id) })
    .then((data) => {
      if (data == null) throw new Error("Course doesn't exists");

      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

module.exports.delelteCourseById = (request, response, next) => {
  Course.findOneAndRemove(new ObjectId(request.params.id))
    .then((data) => {
      response.status(201).json({
        message: "Done",
        data: data,
      });
    })
    .catch((error) => next(error));
};
