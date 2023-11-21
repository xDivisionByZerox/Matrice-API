// Router init
const router = require("express").Router();

// Call controller
const postController = require("../controllers/post.controller");
const likeController = require("../controllers/like.controller");
const { authentificateToken } = require("../utils/auth.js");

router.post('/',    authentificateToken, 
                    postController.verifyExists,
                    likeController.doIlike);

router.post('/like',authentificateToken, 
                    postController.verifyExists, 
                    likeController.verifyDontExists, likeController.like);

router.post('/dislike', authentificateToken, 
                        postController.verifyExists, 
                        likeController.verifyExists, likeController.dislike);

module.exports = router;