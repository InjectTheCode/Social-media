const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const userController = require("../controllers/userController");
const userDescController = require("../controllers/userDescController");

router.route("/").get(authMiddleware.protect, userController.getAllUser);

router.patch("/update-me", authMiddleware.protect, userDescController.updateUserDesc);
router.patch("/follow", authMiddleware.protect, userController.followUser);
router.patch("/unfollow", authMiddleware.protect, userController.unFollowUser);

router.post("/add-user-desc", authMiddleware.protect, userDescController.createUserDesc);

router.delete("/deactivate-me", authMiddleware.protect, userController.deleteMe);

module.exports = router;
