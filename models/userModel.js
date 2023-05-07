const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "User must have a username"],
      min: 3,
      max: 20,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "User must have a email"],
      max: 50,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "User must have a password"],
      min: 3,
      validate: {
        validator: function (el) {
          if (el.length < 3) return false;
          return true;
        },
      },
      select: false,
    },
    passwordConfirm: {
      type: String,
      validate: {
        validator: function (el) {
          return el === this.password; // validator always should return Boolean.
        },
        message: "Passwords do not match",
      },
    },

    passwordChangedAt: Date,

    follewers: {
      type: Array,
      default: [],
    },
    follewings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

userSchema.virtual("information", {
  ref: "UserDesc",
  foreignField: "user",
  localField: "_id",
});

// middlewares.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = undefined;
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

// Methods.
userSchema.methods.checkingHashedPassword = async function (importedPass, userDBPass) {
  return await bcrypt.compare(importedPass, userDBPass);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};

// Exporting User collection.
const User = mongoose.model("User", userSchema);
module.exports = User;
