const mongoose = require("mongoose");
const validator = require("validator");

const userDescModel = mongoose.Schema(
  {
    desciription: {
      type: String,
      max: 250,
      validate: {
        validator: function (el) {
          return el.length < 250;
        },
        message: "Only 250 characters are allowed",
      },
    },
    city: {
      type: String,
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
      message: "You have to choose between these numbers.",
    },
    work: {
      type: String,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Description must belong to a user!"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const UserDesc = mongoose.model("UserDesc", userDescModel);
module.exports = UserDesc;
