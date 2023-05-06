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
    },
    email: {
      type: String,
      required: [true, "User must have a email"],
      max: 50,
      unique: true,
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
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
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
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = undefined;
});

userSchema.methods.checkingHashedPassword = async function (
  importedPass,
  userDBPass
) {
  return await bcrypt.compare(importedPass, userDBPass);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
