// Router init
const router = require("express").Router();

// Call controller
const postController = require("../controllers/post.controller");
const likeController = require("../controllers/like.controller");
const userController = require("../controllers/user.controller");
const { authentificateToken } = require("../utils/auth.js");

router.post('/',    authentificateToken, 
                    postController.verifyExists,
                    likeController.doIlike);

// TODO : AddLike USER
router.post('/like',authentificateToken, 
                    likeController.verifyExists,
                    postController.AddLike,
                    userController.AddLike,
                    likeController.like);

// TODO : AddDislike USER
router.post('/dislike', authentificateToken, 
                        likeController.verifyExists,
                        postController.AddDislike,
                        userController.AddDislike,
                        likeController.dislike);

module.exports = router;