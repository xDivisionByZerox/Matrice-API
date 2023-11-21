// Router init
const router = require("express").Router();

// Call controller
const postController = require("../controllers/post.controller")
const tagController = require("../controllers/tag.controller"); // Only use middlewares
const { authentificateToken } = require("../utils/auth.js");

router.post("/", postController.getPost);
router.post("/create", authentificateToken,tagController.createTags ,postController.createPost);
router.post("/buy", authentificateToken, postController.buyPost);
router.post("/enable", authentificateToken, postController.getPost);
router.post("/disable", authentificateToken);

module.exports = router;