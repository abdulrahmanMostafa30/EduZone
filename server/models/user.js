const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: String,
  cart: {
    items: [
      {
        courseId: {
          type: Schema.Types.ObjectId,
          ref: 'Course'
        },
        quantity: Number,
      },
    ],
  },
});

userSchema.methods.addToCart = function(course) {
  const cartcourseIndex = this.cart.items.findIndex(cp => {
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
      quantity: newQuantity
    });
  }
  const updatedCart = {
    items: updatedCartItems
  };
  this.cart = updatedCart;
  return this.save();
};
module.exports = mongoose.model("User", userSchema);
