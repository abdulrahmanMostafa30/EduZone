const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../utils/email");
const URL_FRONTEND = process.env.URL_FRONTEND

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
    required: false,
  },
  university: {
    type: String,
    required: false,
  },
  faculty: {
    type: String,
    required: false,
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
  cart: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  payments: [
    {
      _id: false,
      paymentId: String,
      courseIds: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },
      ],
      amount: Number,
      isPaid: Boolean,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  purchasedCourses: [
    {
      _id: false,
      orderId: {
        type: String,
        required: true,
      },
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  courseProgress: [
    {
      courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
      currentVideoIndex: {
        type: Number,
        default: 0,
      },
    },
  ],
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationCode: {
    type: String,
    required: false,
    select: false,
  },
  emailVerificationExpiresAt: {
    type: Date,
    required: false,
    select: false,
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
userSchema.methods.createVerificationCode = async function () {
  const verificationCode = crypto.randomBytes(3).toString("hex").toUpperCase();
  const expirationTime = Date.now() + 10 * 60 * 1000; // 10 minutes from now

  const verificationCodeValidityMinutes = 10; // Set the validity duration for the verification code (in minutes)
  const verificationUrl = `${URL_FRONTEND}/verification?code=${verificationCode}`;

  const message = `
    <html>
      <body>
        <h1>Verify Your Email</h1>
        <p>Dear ${this.fname},</p>
        <p>Thank you for signing up. To verify your email, please click on the following link:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>This link is valid for ${verificationCodeValidityMinutes} minutes.</p>
        <p>Best regards,<br>The EduZone Team</p>
      </body>
    </html>
  `;
  
  await sendEmail({
    email: this.email,
    subject: "Email Verification",
    message :message,
  });
  this.emailVerificationCode = verificationCode;
  this.emailVerificationExpiresAt = new Date(expirationTime);
  return verificationCode;
};
userSchema.methods.checkVerificationCode = async function (enteredCode) {
  const user = await this.constructor
    .findById(this._id)
    .select("+emailVerificationCode +emailVerificationExpiresAt")
    .exec();

  if (!user) {
    return false; // User not found
  }

  const storedCode = user.emailVerificationCode;
  const storedExpiration = user.emailVerificationExpiresAt;
  if (!storedCode || !storedExpiration) {
    return false; // Verification code or expiration not found
  }

  const isCodeValid = storedCode === enteredCode;
  const isCodeExpired = storedExpiration <= Date.now();
  user.emailVerificationCode = undefined;
  user.emailVerificationExpiresAt = undefined;
  await user.save({ validateBeforeSave: false });

  return isCodeValid && !isCodeExpired;
};

userSchema.methods.calculateTotalPrice = async function () {
  await this.populate("cart");
  let totalPrice = 0;

  for (const course of this.cart) {
    totalPrice += course.price;
  }

  return totalPrice;
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
