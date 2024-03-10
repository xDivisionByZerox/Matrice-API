const router = require("express").Router();

// Authentificate user token
const { authentificateToken } = require("../utils/auth.js");
// Manage thread
const threadController = require("../controllers/thread.controller.js");
// Take data of token user
const userController = require("../controllers/user.controller.js");
// Get last user likes
const likeController = require("../controllers/like.controller.js");
// Get last user views
const viewController = require("../controllers/view.controller.js");
// Get data of posts liked / seen
const postController = require("../controllers/post.controller.js");

router.post('/create',  authentificateToken,                      // req.user
                        userController.verifyUserTokenThread,     // req.user_token_data
                        threadController.verifyExists,            // req.thread_data
                        viewController.get100latest,              // req.views_ids
                        likeController.get100latest,              // req.likes_ids -- or get the likes of
                        userController.getDataUsersId,
                        likeController.get100latestfromUsers,
                        postController.postsSVDposts,
                        postController.postsLikedViewed,          // posts_data
                        threadController.createThread);

router.post('/delete', authentificateToken,                       // req.user
                       userController.verifyUserTokenThread,      // req.user_token_data
                       threadController.verifyExists,             // req.thread_data
                       threadController.deleteThread);

router.post('/feed',   authentificateToken,                       // req.user
                       userController.verifyUserTokenThread,      // req.user_token_data
                       threadController.verifyExists,             // req.thread_data
                       threadController.feedThread);

module.exports = router;