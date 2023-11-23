const router = require("express").Router();


// Manage thread
const threadController = require("../controllers/thread.controller.js");
// Take data of token user
const userController = require("../controllers/user.controller.js");



const { authentificateToken } = require("../utils/auth.js");

router.post('/create',  authentificateToken,                // req.user
                        userController.verifyUserToken,     // req.user_token_data
                        threadController.verifyExists,      // req.thread_data
                        threadController.createThread);

router.post('/delete', authentificateToken,                 // req.user
                       userController.verifyUserToken,      // req.user_token_data
                       threadController.verifyExists,       // req.thread_data
                       threadController.deleteThread);

router.post('/feed',   authentificateToken,                 // req.user
                       userController.verifyUserToken,      // req.user_token_data
                       threadController.verifyExists,       // req.thread_data
                       threadController.feedThread);

module.exports = router;