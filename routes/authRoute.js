const authController = require("../controllers/authController");
const router = require("express").Router();

router.route("/signup").get(authController.signUp);
router.route("/login").post(authController.login);

router.route("/").get(authController.protect, authController.getAll);

module.exports = router;
