
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Contact = require("./../models/contact");

exports.getItems = catchAsync(async (req, res, next) => {
  const contacts = await Contact.find({});

  res.status(200).json({
    status: "success",
    data: contacts,
  });
});

exports.add = catchAsync(async (req, res, next) => {
  const { email, message } = req.body;

  const contact = await new Contact({
    email: email,
    message: message,
  });
  await contact.save();

  res.status(200).json({
    status: "success",
    data: contact,
  });
});

exports.remove = catchAsync(async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await Contact.findByIdAndDelete(contactId);

  if (!contact) {
    return next(new AppError("Contact does not exist.", 404));
  }

  res.status(200).json({
    status: "success",
    data: contact,
  });
});
