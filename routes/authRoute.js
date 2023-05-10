const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = require("express").Router();

// this is for Admin, it can see both active and inactive users.
router.get(
  "/get-all-users",
  authMiddleware.protect,
  authMiddleware.checkAdmin,
  authController.getAllDeActivatedUser
);

router.route("/signup").post(authController.signUp);
router.route("/login").post(authController.login);

router.patch(
  "/update-my-password",
  authMiddleware.protect,
  authController.updateMyPassword
);

router.delete("/delete-user", authController.fullyDeleteUser);

module.exports = router;
