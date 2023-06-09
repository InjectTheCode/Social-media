const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOption = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOption.secure = true;
  res.cookie("jwt", token, cookieOption);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  createSendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password.", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.checkingHashedPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password.", 401));
  }
  createSendToken(user, 200, res);
});

exports.updateMyPassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  if (!(await user.checkingHashedPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong", 401));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  const token = signToken(user.id);
  res.status(201).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

// this is for Admin, it can see both active and inactive users.
exports.getAllDeActivatedUser = catchAsync(async (req, res, next) => {
  let findObjSitusation = {};
  req.query.isActive
    ? (findObjSitusation["isActive"] = req.query.isActive)
    : (findObjSitusation = {});

  const users = await User.find(findObjSitusation);
  if (users.length <= 0) {
    return next(new AppError("There is no user to show", 404));
  }
  res.status(201).json({
    status: "success",
    length: users.length,
    data: {
      users,
    },
  });
});

exports.fullyDeleteUser = catchAsync(async (req, res, next) => {
  if (!req.body.id) return next(new AppError("You need to provide user's ID."));
  const user = await User.findOneAndDelete({ _id: req.body.id });
  if (!user) return next(new AppError("No user was found with this ID."));
  res.status(200).json({
    status: "success",
    data: null,
  });
});
