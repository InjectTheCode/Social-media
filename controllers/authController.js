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
  if (!user || !user.checkingHashedPassword(password, user.password)) {
    return next(new AppError("Incorrect email or password.", 401));
  }
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.body;
  let token;
  if (authorization) {
    token = authorization.includes("Bearer")
      ? authorization.split(" ")[1]
      : authorization;
  }
  if (!token) {
    return next(
      new AppError("You are not logged in, Please log in to get access", 401)
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
});

exports.getAll = catchAsync(async (req, res, next) => {
  const allusers = await User.find();
  res.status(200).json({
    data: allusers,
  });
});
