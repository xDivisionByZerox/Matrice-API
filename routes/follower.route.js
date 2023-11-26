// Router init
const router = require("express").Router();

// Call controller
const userController = require("../controllers/user.controller");
const followerController = require("../controllers/follower.controller");
const postController = require("../controllers/post.controller");
const { authentificateToken } = require("../utils/auth.js");

router.post('/',authentificateToken, 
                userController.verifyExists,
                followerController.verifyExists, 
                followerController.doIfollow);
                
router.post('/follow', authentificateToken, 
                       userController.verifyExists,
                       followerController.verifyExists, 
                       userController.sub,
                       followerController.follow);

router.post('/unfollow',authentificateToken, 
                        userController.verifyExists,
                        followerController.verifyExists,
                        userController.unSub,
                        followerController.unfollow);

router.post('/follower',authentificateToken,
                        followerController.Follower10others,
                        userController.getDataUsersId,
                        followerController.followers);

router.post('/followed',authentificateToken,
                        followerController.Followed10others,
                        userController.getDataUsersId,
                        followerController.followed);

module.exports = router;