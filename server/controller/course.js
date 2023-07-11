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
module.exports.getPurchasedCourses = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  // Retrieve the user from the database
  const user = await User.findById(userId).populate(
    "purchasedCourses.courseId"
  );

  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }
  response.status(200).json({
    status: "success",
    data: user.purchasedCourses,
  });
});

module.exports.getAllCourses = catchAsync(async (request, response, next) => {
  const isAuthenticated = request.isAuthenticated;
  if (!isAuthenticated) {
    const courses = await Course.find({ active: true });
    return response.status(200).json(courses);
  } else {
    console.log(isAuthenticated)
    const userRole = request.user.role;
    const query = userRole === "admin" ? {} : { active: true };
    const courses = await Course.find(query);
    return response.status(200).json(courses);
  }
});
module.exports.updateCourseStatus = catchAsync(
  async (request, response, next) => {
    const { courseId } = request.params;
    const { active } = request.body;
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { active },
      { new: true }
    );
    return response.status(200).json(updatedCourse);
  }
);
module.exports.addCourse = catchAsync(async (request, response, next) => {
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
});

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
    "vid",
    "comments",
    "active"
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

module.exports.getCourseById = catchAsync(async (request, response, next) => {
  Course.findOne({ _id: new ObjectId(request.params.id) })
    .then((data) => {
      if (data == null) throw new Error("Course doesn't exists");

      response.status(200).json(data);
    })
    .catch((error) => next(error));
});

module.exports.addComment = catchAsync(async (request, response, next) => {
  const { id, comment, rating } = request.body;
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
    rating: rating,
    imageUserPath: request.user.imagePath,
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
module.exports.deleteCourseById = catchAsync(
  async (request, response, next) => {
    Course.findOneAndRemove(new ObjectId(request.params.id))
      .then((data) => {
        response.status(201).json({
          message: "Done",
          data: data,
        });
      })
      .catch((error) => next(error));
  }
);
