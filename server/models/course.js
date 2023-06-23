const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  title: String,
  description: String,
  category: String,
  price: String,
  image: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});
module.exports = mongoose.model("Course", courseSchema);
