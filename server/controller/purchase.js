const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Course = require("../models/course");
const paypal = require("paypal-rest-sdk");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Initialize Stripe with your secret key

const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

// Set up PayPal configuration
paypal.configure({
  mode: "sandbox", // Change to "live" for production environment
  client_id:
    "AZ1pef0q2Bt30xoYFzn57qSAZ2RhEOFlRIYhNHttUjNKDkejojqRJxhWqEPAxUJlqvcVyUIYzJU0p5g2",
  client_secret:
    "EOaxtxJrChOxw8y2n7D9UHXVTibw9lWr2BfHj_bLOZzdNjLR9YQFLAjPmGWNc0msJbeC3WgVa6LiueHt",
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
        return_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
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
        return res
          .status(500)
          .json({ error: "Failed to create PayPal payment." });
      }

      try {
        if (!user.payments) {
          user.payments = [];
        }
        // Save the payment information in the user's data
        user.payments.push({
          paymentId: payment.id,
          amount: total,
          isPaid: false,
          courseIds: courseIds,
        });
        user.confirmPassword = user.password; // Assign the same value as the password to confirmPassword
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
        return res
          .status(500)
          .json({ error: "Failed to save payment information." });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create PayPal payment." });
  }
});

// Execute Payment
const executePayment = catchAsync(async (req, res) => {
  const payerId = req.query.payerId;
  const paymentId = req.query.paymentId;
  const payment = req.user.payments.find(p => p.paymentId === paymentId);
  const courseIds = payment.courseIds;

  const execute_payment_json = {
    payer_id: payerId,
  };
  // const capture = await paypal.capturePayment(paymentId);

  // try {

  //   paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
  //     if (error) {
  //       throw error;
  //     } else {
  //       // Handle the captured payment response
  //       console.log(payment);
  //     }
  //   });
  // } catch (error) {
  //   // Handle any errors that occurred during payment capture
  //   console.error(error);
  // }

  // try {
  //   // Capture the payment using PayPal APIs
  //   const response = await paypal.payment.execute(paymentId, { payer_id: payerId});

  //   if (capture.status === 'COMPLETED') {
  //     // Payment is captured successfully
  //     // Update the payment status in your database or perform any other necessary actions
  //     // Return a success response
  //     res.status(200).json({ message: 'Payment captured successfully.' });
  //   } else {
  //     // Payment capture failed
  //     // Return an error response
  //     res.status(400).json({ error: 'Payment capture failed.' });
  //   }
  // } catch (error) {
  //   // Handle any errors that occurred during payment capture
  //   console.error(error);
  //   res.status(500).json({ error: 'Failed to capture payment.' });
  // }
  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    async (error, payment) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .json({ error: "Failed to execute PayPal payment." });
      }

      if (payment.state === "approved") {
        try {
          // Update the payment status in the user's data
          const updatedUser = await User.findOneAndUpdate(
            { "payments.paymentId": paymentId },
            {
              $set: { "payments.$.isPaid": true },
              $push: {
                purchasedCourses: {
                  $each: courseIds.map(courseId => ({
                    orderId: paymentId,
                    courseId: courseId,
                  })),
                },
              },
            }
          );
          if (!updatedUser) {
            return res
              .status(404)
              .json({ error: "User not found or payment not found." });
          }
          updatedUser.cart = [];
          await updatedUser.save({ validateBeforeSave: false });

          return res.status(200).json({ message: "Payment successful." });

          // res.render("success"); // Render success page
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Failed to update payment status." });
        }
      } else {
        res.status(400).json({ error: "Payment not approved." });
      }
    }
  );
});

module.exports = {
  createPayment,
  executePayment,
};
