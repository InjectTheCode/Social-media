const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const UserDesc = require("../models/userDescModel");
const User = require("../models/userModel");

const filteredObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUser = catchAsync(async (req, res, next) => {
  const allusers = await User.find().populate({
    path: "information",
    select: "-__v -coverPicture",
  });
  res.status(200).json({
    data: allusers,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { isActive: false });
  res.status(200).json({
    status: "success",
    data: null,
  });
});
