const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const UserDesc = require("../models/userDescModel");
const User = require("../models/userModel");

exports.getAllUser = catchAsync(async (req, res, next) => {
  const allusers = await User.find({ isActive: true }).populate({
    path: "information",
    select: "-__v -coverPicture",
  });
  res.status(200).json({
    status: "success",
    length: allusers.length,
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

exports.followUser = catchAsync(async (req, res, next) => {
  const followedUserId = req.body.id;
  const followingUserId = req.user.id; // a user who wants to follow other user.

  if (req.user.followings.includes(followedUserId)) {
    return next(new AppError("You have already been following this user.", 401));
  }

  const followed = await User.findByIdAndUpdate(
    { _id: followingUserId },
    { $push: { followings: followedUserId } }
  );

  const following = await User.findByIdAndUpdate(
    { _id: followedUserId },
    { $push: { followers: followingUserId } }
  );

  const followedUser = await User.findById(followedUserId);

  res.status(200).json({
    status: "success",
    message: `you are now following. ${followedUser.username}`,
  });
});
