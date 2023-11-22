// Router init
const router = require("express").Router();

// Call controller
const postController = require("../controllers/post.controller");
const likeController = require("../controllers/like.controller");
const { authentificateToken } = require("../utils/auth.js");

router.post('/',    authentificateToken, 
                    postController.verifyExists,
                    likeController.doIlike);

// TODO : AddLike USER
router.post('/like',authentificateToken, 
                    likeController.verifyExists,
                    postController.AddLike, 
                    likeController.like);

// TODO : AddDislike USER
router.post('/dislike', authentificateToken, 
                        likeController.verifyExists,
                        postController.AddDislike, 
                        likeController.dislike);

module.exports = router;