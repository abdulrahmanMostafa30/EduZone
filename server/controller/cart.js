const { promisify } = require("util");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("./../models/user");

exports.getItems = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate("cart").exec();

  res.status(200).json({
    status: "success",
    data: user.cart,
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
