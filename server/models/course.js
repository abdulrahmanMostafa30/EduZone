const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  title: {
    type: String,
    required: [true, "Please tell us the title!"],
  },
  description: {
    type: String,
    required: [true, "Please tell us the description!"],
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category", // Reference to the Category schema
    required: [true, "Please tell us the category!"],
  },
  price: {
    type: Number,
    required: [true, "Please tell us the price!"],
  },
  image: {
    type: String,
    required: [true, "Please tell us the image!"],
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
      rating: {
        type: Number,
        required: true,
      },
      imageUserPath: {
        type: String,
        required: true,
      }
    },
  ],
  vid: [],
  purchasedCourses: [
    {
      course: {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
      purchaseDate: {
        type: Date,
        default: Date.now,
      },
      paymentAmount: {
        type: Number,
        required: true,
      },
    },
  ],
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
