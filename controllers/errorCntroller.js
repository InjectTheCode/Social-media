const AppError = require("../utils/appError");

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(", ")}`;
  return new AppError(message, 400);
};
const handleDuplicateErrorDB = (err) => {
  const value = err.keyValue.email || err.keyValue.username;
  const message = `Duplicate input field value: ${value}, Please use a different value.`;
  return new AppError(message, 400);
};

const devErrorHandler = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const prodErrorHandler = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    devErrorHandler(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (err.name === "ValidationError") {
      error = handleValidationErrorDB(error);
    }
    if (err.code === 11000) {
      error = handleDuplicateErrorDB(error);
    }

    prodErrorHandler(error, res);
  }
};
