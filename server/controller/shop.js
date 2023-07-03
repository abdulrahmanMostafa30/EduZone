const Course = require('../models/course');


exports.postCart = (req, res, next) => {
    const prodId = req.body.CourseId;
    Course.findById(prodId)
      .then(Course => {
        return req.user.addToCart(Course);
      })
      .then(result => {
        res.redirect('/cart');
      });
  };
  