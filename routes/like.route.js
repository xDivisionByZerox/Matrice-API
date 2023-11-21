// Router init
const router = require("express").Router();

// Call controller
const postController = require("../controllers/post.controller");
const likeController = require("../controllers/like.controller");
const { authentificateToken } = require("../utils/auth.js");

router.post('/like', authentificateToken, postController.verifyExists, likeController.like);
router.post('/dislike', authentificateToken, postController.verifyExists, likeController.dislike);



module.exports = router;