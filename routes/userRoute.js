const router = require("express").Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const userDescController = require("../controllers/userDescController");

router.route("/signup").get(authController.signUp);
router.route("/login").post(authController.login);

router.route("/").get(authController.protect, userController.getAllUser);

router.patch(
  "/update-my-password",
  authController.protect,
  authController.updateMyPassword
);
router.patch("/update-me", authController.protect, userDescController.updateUserDesc);

router.post("/add-user-desc", authController.protect, userDescController.createUserDesc);

router.delete("/delete-me", authController.protect, userController.deleteMe);

module.exports = router;
