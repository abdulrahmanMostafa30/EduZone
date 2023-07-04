const Course = require("../models/course");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

module.exports.getAllCourses = (request, response, next) => {
  const isAuthenticated = request.isAuthenticated; // Assuming you're using a session-based authentication
  if (!isAuthenticated) {
    Course.find({ active: true })
      .then((data) => {
        response.status(200).json(data);
      })
      .catch((error) => next(error));
  } else {
    const userRole = request.user.role;
    const query = userRole === "admin" ? {} : { active: true };
    Course.find(query)
      .then((data) => {
        response.status(200).json(data);
      })
      .catch((error) => next(error));
  }
};

module.exports.updateCourseStatus = (request, response, next) => {
  const { courseId } = request.params;
  const { active } = request.body;

  Course.findByIdAndUpdate(courseId, { active }, { new: true })
    .then((updatedCourse) => {
      response.status(200).json(updatedCourse);
    })
    .catch((error) => next(error));
};
module.exports.addCourse = (request, response, next) => {
  let image = request.body.image;
  if (request.file) {
    image = request.file.imageUrl;
    // const url = request.protocol + "://" + request.get("host");
    // image = url + "/images/" + request.file.filename;
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
    vid: vid,
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
  let image = request.body.imagePath;
  if (request.file) {
    image = request.file.imageUrl;
    // const url = request.protocol + "://" + request.get("host");
    // image = url + "/images/" + request.file.filename;
  }

  const filteredBody = filterObj(
    request.body,
    "title",
    "description",
    "category",
    "price",
    "vid"
  );
  filteredBody["image"] = image;

  const updatedCourse = await Course.findByIdAndUpdate(
    request.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  response.status(200).json({
    status: "success",
    data: {
      course: updatedCourse,
    },
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

module.exports.addComment = catchAsync(async (request, response, next) => {
  const { id, comment } = request.body;
  const user = request.user;
  // console.log(id, comment, user)
  const course = await Course.findById(id);

  if (!course) {
    return next(new AppError("Course not found.", 401));
  }
  const existingComment = course.comments.find(
    (c) => c._id.toString() === request.user._id.toString()
  );

  if (existingComment) {
    return next(new AppError("User already added a comment", 401));
  }

  const newComment = {
    _id: request.user._id,
    name: `${request.user.fname} ${request.user.lname}`,
    comment: comment,
  };

  course.comments.push(newComment);
  await course.save();

  response.status(200).json({
    status: "success",
    data: {
      course: course.comments,
    },
  });
});
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
