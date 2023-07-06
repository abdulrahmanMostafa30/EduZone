const User = require("../models/user");
const Course = require("../models/course");
const paypal = require("paypal-rest-sdk");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Initialize Stripe with your secret key

const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

paypal.configure({
  mode: "sandbox",
  client_id: "YOUR_SANDBOX_CLIENT_ID",
  client_secret: "YOUR_SANDBOX_CLIENT_SECRET",
});

// Configure PayPal SDK
paypal.configure({
  mode: "sandbox",
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

const purchaseCourse = catchAsync(async (req, res) => {
  try {
    // Retrieve user ID from authenticated user
    const userId = req.user._id;

    // Retrieve course ID and payment amount from request body
    const { courseId, paymentAmount, paymentMethod } = req.body;

    // Retrieve course details
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Retrieve authenticated user's details
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let paymentResult;

    if (paymentMethod === "paypal") {
      // Create a PayPal payment
      const createPayment = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: "http://localhost:3000/success", // Replace with your return URL
          cancel_url: "http://localhost:3000/cancel", // Replace with your cancel URL
        },
        transactions: [
          {
            amount: {
              total: paymentAmount.toFixed(2),
              currency: "USD",
            },
            description: `Purchase of ${course.title}`,
          },
        ],
      };

      // Initiate the PayPal payment
      const paypalPayment = await new Promise((resolve, reject) => {
        paypal.payment.create(createPayment, (error, payment) => {
          if (error) {
            reject(error);
          } else {
            resolve(payment);
          }
        });
      });

      // Store the PayPal payment details in the user document
      user.purchasedCourses.push({
        course: course._id,
        paymentAmount: paymentAmount,
        paymentMethod: "PayPal",
        paymentId: paypalPayment.id,
      });

      paymentResult = paypalPayment;
    } else if (paymentMethod === "stripe") {
      // Create a Stripe payment
      const stripePayment = await stripe.paymentIntents.create({
        amount: paymentAmount * 100, // Stripe amount is in cents, so multiply by 100
        currency: "usd",
        description: `Purchase of ${course.title}`,
      });

      // Store the Stripe payment details in the user document
      user.purchasedCourses.push({
        course: course._id,
        paymentAmount: paymentAmount,
        paymentMethod: "Stripe",
        paymentId: stripePayment.id,
      });

      paymentResult = stripePayment;
    } else {
      return res.status(400).json({ error: "Invalid payment method" });
    }

    // Save the updated user document
    await user.save();

    return res.json({
      message: "Course purchased successfully",
      paymentResult,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = {
  purchaseCourse,
};
