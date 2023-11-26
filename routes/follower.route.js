// Router init
const router = require("express").Router();

// Call controller
const userController = require("../controllers/user.controller")
const followerController = require("../controllers/follower.controller")
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

module.exports = router;