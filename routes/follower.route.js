// Router init
const router = require("express").Router();

// Call controller
const userController = require("../controllers/user.controller")
const followerController = require("../controllers/follower.controller")
const { authentificateToken } = require("../utils/auth.js");

router.post('/follow', authentificateToken, userController.verifyUserExists, followerController.follow);
router.post('/unfollow', authentificateToken, userController.verifyUserExists, followerController.unfollow);

module.exports = router;