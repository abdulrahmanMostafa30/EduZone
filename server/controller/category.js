const catchAsync = require("../utils/catchAsync");
const Category = require("../models/category");

exports.getCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json(categories);
});

exports.createCategory = catchAsync(async (req, res, next) => {
  const newCategory = await Category.create(req.body);
  res.status(201).json(newCategory);
});

exports.deleteCategory = catchAsync(async (req, res, next) => {

  const categoryId = req.params.id;
  const deletedCategory = await Category.findByIdAndDelete(categoryId);

  if (!deletedCategory) {
    return res.status(404).json({ message: "Category not found." });
  }

  res.status(200).json({ message: "Category deleted successfully." });
});

