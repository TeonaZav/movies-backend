const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const filterObj = (obj, ...fields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (fields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const query = User.find();
  const users = await query;
  res.status(200).json({
    status: "success",
    result: users.length,
    data: users,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate("bookmarks");
  if (!user) {
    return next(new AppError("There is no user with mentioned id", 404));
  }
  res.status(200).json({
    status: "success",
    data: { user },
  });
});
exports.updateAccount = catchAsync(async (req, res, next) => {
  //update user document
  const filteredBody = filterObj(req.body, "name");
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});
exports.getUserBookmarked = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("There is no user with mentioned id", 404));
  }

  res.status(200).json({
    status: "success",
    data: user.bookmarks,
  });
});

exports.updateUserBookmarks = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, "bookmarks");
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});
