const UserDesc = require("../models/userDescModel");
const catchAsync = require("../utils/catchAsync");

exports.createUserDesc = catchAsync(async (req, res, next) => {
  const userDesc = await UserDesc.create({ user: req.user.id, ...req.body });
  res.status(201).json({
    status: "success",
    data: {
      data: userDesc,
    },
  });
});

exports.updateUserDesc = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This is not for password updates. Please use /update-my-password.",
        400
      )
    );
  }
  const filtered = filteredObj(req.body, "desciription", "city", "relationship", "work");
  const updatedUser = await UserDesc.findOneAndUpdate({ user: req.user.id }, filtered, {
    new: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});
