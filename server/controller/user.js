const User = require("./../models/user");
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

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.updateMe = catchAsync(async (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    imagePath = req.file.imageUrl;
    // const url = req.protocol + "://" + req.get("host");
    // imagePath = url + "/images/" + req.file.filename;
  }

  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }
  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    "fname",
    "lname",
    "fullName",
    "birthDate",
    "imagePath",
    "country",
    "address",
    "university",
    "faculty",
    "department",
    'courseProgress'
  );
  if (imagePath) {
    filteredBody["imagePath"] = imagePath;
  }
  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined! Please use /signup instead",
  });
};

// exports.getUserCourses = async (req, res, next) => {
//   console.log('getUserCourses')
  
//   try {
//     const user = factory.getOne(User, { path: 'purchasedCourses', populate: { path: 'courseId' }})
//     console.log(user(req))
//     if (!user) {
//       return res.status(404).json({ error: 'User not found.' });
//     }

//     res.status(200).json({
//       status: 'success',
//       data: user.purchasedCourses,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to fetch user courses.' });
//   }
// };
exports.getUserCourses = (req, res) => {
  const { id } = req.params;
  const populateOptions = { path: 'purchasedCourses', populate: { path: 'courseId' }};
  
  req.customCallback = (doc) => {
    res.status(200).json({
      status: 'success',
      data: doc.purchasedCourses
    });
  };

  factory.getOne(User, populateOptions)(req, res);
};
exports.getUser = factory.getOne(User, { path: 'purchasedCourses', populate: { path: 'courseId' }});
// exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
// exports.getUserCourses = factory.getOne(User, { path: 'purchasedCourses.courseId' });
// exports.getUserCourses = factory.getOne(User, { path: 'purchasedCourses', populate: { path: 'courseId' }});

// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
