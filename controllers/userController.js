const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This is not for password updates. Please use /update-my-password.",
        400
      )
    );
  }
});
