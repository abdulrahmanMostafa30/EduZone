const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SchemaTypeOptions = mongoose.SchemaTypeOptions;
const courseSchema = new Schema({
  title: {
    type: String,
    required: [true, "Please tell us title!"],
  },
  description: {
    type: String,
    required: [true, "Please tell us description!"],
  },
  category: {
    type: String,
    required: [true, "Please tell us category!"],
  },
  price: {
    type: Number,
    required: [true, "Please tell us price!"],
  },
  image: {
    type: String,
    required: [true, "Please tell us image!"],
  },
  comments: [
    {
      _id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  vid: [],
  active: {
    type: Boolean,
    default: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Course", courseSchema);
