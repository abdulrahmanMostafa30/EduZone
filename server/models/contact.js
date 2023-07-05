const mongoose = require("mongoose");
const validator = require("validator");

// Define the schema for the contact message
const ContactSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: [validator.default.isEmail, "Please provide a vaild email"],
  },
  message: {
    type: String,
    required: true,
  },
});

// Create and export the Contact model based on the schema
module.exports = mongoose.model("Contact", ContactSchema);
