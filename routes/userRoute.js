const router = require("express").Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

router.patch(
  "/update-my-password",
  authController.protect,
  authController.updateMyPassword
);

router.patch("/update-me", authController.protect, userController.updateMe);

// router.delete("/deleteMe");

module.exports = router;
