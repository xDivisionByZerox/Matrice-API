const router = require("express").Router();

const viewController = require("../controllers/view.controller");
const postController = require("../controllers/post.controller");
const { authentificateToken } = require("../utils/auth");

router.post("/",authentificateToken,            // req.user
                postController.verifyExists,    // req.post_data
                viewController.verifyExists,    // req.view_data
                viewController.view)

module.exports = router;