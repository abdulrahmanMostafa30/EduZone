const { promisify } = require("util");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("./../models/user");

exports.getItems = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    path: "cart",
    populate: {
      path: "category",
      model: "Category", // Replace with the actual name of your Category model
    },
  });
  const cartWithCategoryAsName = user.cart.map((course) => ({
    ...course.toObject(),
    category: course.category.name,
  }));
  res.status(200).json({
    status: "success",
    data: cartWithCategoryAsName,
  });

  // User.findById(req.user.id)
  // .populate('cart')
  // .exec()
  // .then(user => {
  //   const coursesInCart = user.cart;
  //   console.log(coursesInCart);
  // })

  // const cartItems = await User.findById(req.user.id)
  // .populate('cart')
  // .exec((err, user) => {
  //   if (err) {
  //     console.error(err);
  //     return;
  //   }

  //   // Access the populated courses in the user's cart
  //   const coursesInCart = user.cart;

  //   // Do something with the courses
  //   console.log(coursesInCart);
  // });

  //   const cartItems = await User.find({ _id: req.user.id }, { cart: 1 }).populate(
  //     {
  //       path: "Course", // populate blogs
  //       populate: {
  //         path: "cart", // in blogs, populate comments
  //       },
  //     }
  //   );
  //
  //   if (cartItems.length > 0) {
  //     res.status(200).json({
  //       status: "success",
  //       data: cartItems,
  //     });
  //   } else {
  //     return next(new AppError("Shoping cart is empty!", 400));
  //   }
});

exports.add = catchAsync(async (req, res, next) => {
  const { courseId } = req.body;
  const user = await User.findOne({
    _id: req.user._id,
    $or: [
      { purchasedCourses: { $elemMatch: { courseId } } },
      { cart: courseId },
    ],
  });

  if (user) {
    if (user.purchasedCourses.some(course => course.courseId.equals(courseId))) {
      return res.status(400).json({
        status: "error",
        message: "The course is already purchased.",
      });
    }

    return res.status(400).json({
      status: "error",
      message: "The course is already in the cart.",
    });
  }
  
  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $addToSet: { cart: courseId } },
    { upsert: true, new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      cart: updatedUser.cart,
    },
  });
});

exports.remove = catchAsync(async (req, res, next) => {
  const { cartItemId } = req.params;
  const user = await User.findOne({ _id: req.user.id, cart: cartItemId });

  if (!user) {
    return next(new AppError("Course does not exist in the cart.", 404));
  }

  const updatedCart = await User.updateOne(
    { _id: req.user._id },
    { $pull: { cart: cartItemId } }
  );

  res.status(200).json({
    status: "success",
    data: {
      course: updatedCart,
    },
  });
});
