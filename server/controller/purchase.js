const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Course = require("../models/course");
const paypal = require("paypal-rest-sdk");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Initialize Stripe with your secret key

const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const URL_FRONTEND = process.env.URL_FRONTEND;

// Set up PayPal configuration
paypal.configure({
  mode: "sandbox", // Change to "live" for production environment
  client_id: PAYPAL_CLIENT_ID,
  client_secret: PAYPAL_CLIENT_SECRET,
});

// Create Payment
const createPayment = catchAsync(async (req, res) => {
  const userId = req.user.id; // Get the user ID from req.user
  try {
    // Retrieve the user from the database
    const user = await User.findById(userId).populate("cart");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    const courseIds = user.cart.map((course) => course._id);

    const total = await user.calculateTotalPrice();
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "/success",
        cancel_url: "/cancel",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "Red Sox Hat",
                sku: "002",
                price: total.toFixed(2),
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: total.toFixed(2),
          },
          description: "Hat for the best team ever",
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, payment) => {
      if (error) {
        console.error(error);
        return next(new AppError("Failed to create PayPal payment.", 500));
      }

      try {
        if (!user.payments) {
          user.payments = [];
        }
        user.payments.push({
          paymentId: payment.id,
          amount: total,
          isPaid: false,
          courseIds: courseIds,
        });
        await user.save({ validateBeforeSave: false });

        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            return res.json({
              orderId: payment.id,
              approvalUrl: payment.links[i].href,
            });
          }
        }
      } catch (error) {
        console.error(error);
        return next(new AppError("Failed to save payment information.", 500));
      }
    });
  } catch (error) {
    console.error(error);
    return next(new AppError("Failed to create PayPal payment.", 500));
  }
});

// Execute Payment
const executePayment = catchAsync(async (req, res, next) => {
  const payerId = req.query.payerId;
  const paymentId = req.query.paymentId;
  const payment = req.user.payments.find((p) => p.paymentId === paymentId);
  const courseIds = payment.courseIds;

  const execute_payment_json = {
    payer_id: payerId,
  };
  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    async (error, payment) => {
      if (error) {
        return next(new AppError("Failed to execute PayPal payment.", 500));
      }

      if (payment.state === "approved") {
        try {
          const updatedUser = await User.findOneAndUpdate(
            { "payments.paymentId": paymentId },
            {
              $set: { "payments.$.isPaid": true },
              $push: {
                purchasedCourses: {
                  $each: courseIds.map((courseId) => ({
                    orderId: paymentId,
                    courseId: courseId,
                  })),
                },
              },
            }
          );
          if (!updatedUser) {
            return next(
              new AppError("User not found or payment not found.", 404)
            );
          }
          updatedUser.cart = [];
          await updatedUser.save({ validateBeforeSave: false });
          return res.status(200).json({ message: "Payment successful." });
        } catch (error) {
          console.error(error);
          return next(new AppError("Failed to update payment status.", 500));
        }
      } else {
        return next(new AppError("Payment not approved.", 400));
      }
    }
  );
});

module.exports = {
  createPayment,
  executePayment,
};
