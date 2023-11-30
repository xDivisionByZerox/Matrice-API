// Router init
const router = require("express").Router();

// Call controller
const postController = require("../controllers/post.controller")
const tagController = require("../controllers/tag.controller");
const userController = require("../controllers/user.controller");
const { authentificateToken } = require("../utils/auth.js");

router.post("/", postController.verifyExists,
                 postController.getPost);

router.post("/create", authentificateToken,
                       tagController.createTags,
                       postController.verifyMotherId,   // req.mother_data
                       userController.addPost,
                       postController.createPost);

router.post("/buy", authentificateToken,
                    postController.verifyExists,    // Verify post exists and get his data - post_data
                    userController.verifyOwner,     // Verify owner exists and get his data - owner_data
                    userController.verifyUserToken, // Verify token user exists and get his data - req.user_token_data
                    userController.buyTransaction,  // Give coins to the post owner(req.owner_data) take it from token user(req.user_token_data)
                    postController.buyPost);        // Modify the post owner

router.post("/enable",  authentificateToken,
                        postController.verifyExists,
                        postController.verifyOwner,
                        postController.enablePost);

router.post("/disable", authentificateToken,
                        postController.verifyExists,
                        postController.verifyOwner,
                        postController.disablePost);

router.post("/profile", userController.verifyExists
                      , postController.verifyExists
                      , postController.profile);

router.post("/group",   postController.group);

router.post("/comment", postController.verifyExists     // req.body.post_id     ----> req.post_data
                      , postController.comment);        // Return 10 comments

module.exports = router;