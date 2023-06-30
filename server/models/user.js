const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const catchAsync = require("../utils/catchAsync");

const Schema = mongoose.Schema;
const userSchema = new Schema({
  fname: {
    type: String,
    required: [true, "Please tell us your fname!"],
  },
  lname: {
    type: String,
    required: [true, "Please tell us your lname!"],
  },
  fullName: {
    type: String,
    required: false,
  },
  birthDate: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: [true, "Please tell us your email!"],
    unique: true,
    lowercase: true,
    validate: [validator.default.isEmail, "Please provide a vaild email"],
  },
  password: {
    type: String,
    required: [true, "please provide a password!"],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "please confirm a password!"],
    minlength: 8,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password is not a same!",
    },
  },
  imagePath: {
    type: String,
  },
  country: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false
  },
  university: {
    type: String,
    required: false,
  },
  faculty: {
    type: String,
    required:false,
  },
  department: {
    type: String,
    required: false,
  },
  note: {
    type: String,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  cart: {
    items: [
      {
        courseId: {
          type: Schema.Types.ObjectId,
          ref: "Course",
        },
      },
    ],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});
userSchema.pre("save", async function (next) {
  // only if password is Modified
  if (!this.isModified("password")) {
    return next();
  }
  // hash password to databse
  this.password = await bcrypt.hash(this.password, 12);

  // delete confirmPassword from srore in database
  this.confirmPassword = undefined;
  next();
});
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};
userSchema.methods.addToCart = function (course) {
  const cartcourseIndex = this.cart.items.findIndex((cp) => {
    return cp.courseId.toString() === course._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartcourseIndex >= 0) {
    newQuantity = this.cart.items[cartcourseIndex].quantity + 1;
    updatedCartItems[cartcourseIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      courseId: course._id,
      quantity: newQuantity,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
