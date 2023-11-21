// Router init
const router = require("express").Router();

// Call controller
const postController = require("../controllers/post.controller")
const { authentificateToken } = require("../utils/auth.js");

router.post("/", postController.getPost);
router.post("/create", authentificateToken, postController.createPost);
router.post("/buy", authentificateToken, postController.buyPost);
router.post("/enable", authentificateToken, postController.getPost);
router.post("/disable", authentificateToken);
router.post("/comment", authentificateToken);

module.exports = router;