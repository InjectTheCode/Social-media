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
  const userLoggedIn = req.user.id; // a user who wants to follow other user.

  const followedUser = await User.findById(followedUserId);

  if (req.user.followings.includes(followedUserId)) {
    return next(
      new AppError(`You have already following ${followedUser.username}.`, 401)
    );
  }

  const followed = await User.findByIdAndUpdate(
    { _id: userLoggedIn },
    { $push: { followings: followedUserId } }
  );
  const following = await User.findByIdAndUpdate(
    { _id: followedUserId },
    { $push: { followers: userLoggedIn } }
  );

  res.status(200).json({
    status: "success",
    message: `you are now following, ${followedUser.username}`,
  });
});

exports.unFollowUser = catchAsync(async (req, res, next) => {
  const userLoggedIn = req.user.id;
  const unFollowedUser = req.body.id;

  const followedUserInfo = await User.findById(unFollowedUser);

  if (!userLoggedIn.includes(unFollowedUser)) {
    return next(new AppError("User does not exist in your following users.", 404));
  }

  await User.findByIdAndUpdate(
    { _id: userLoggedIn },
    { $pull: { followings: unFollowedUser } }
  );
  await User.findByIdAndUpdate(
    { _id: unFollowedUser },
    { $pull: { followers: userLoggedIn } }
  );

  res.status(200).json({
    status: "success",
    message: `you have unFollowed, ${followedUserInfo.username}.`,
  });
});
