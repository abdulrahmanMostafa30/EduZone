const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  title: String,
  description: String,
  category: String,
  price: String,
  image: String,
});
module.exports = mongoose.model("Course", CourseSchema);