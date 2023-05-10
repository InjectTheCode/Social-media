const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

exports.protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  let token;
  if (authorization) {
    token = authorization.includes("Bearer")
      ? authorization.split(" ")[1]
      : authorization;
  }
  if (!token) {
    return next(new AppError("You are not logged in, Please log in to get access", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token does no longer exist,", 401)
    );
  }
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }
  req.user = currentUser;
  next();
});

exports.checkAdmin = catchAsync(async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(new AppError("You don't have permission to perform this action", 403));
  }
  next();
});
