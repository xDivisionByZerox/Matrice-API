// Router init
const router = require("express").Router();

// Call controller
const conversationController = require("../controllers/conversation.controller");
const userController = require("../controllers/user.controller");
const { authentificateToken } = require("../utils/auth.js");

// Manage the conversation
router.post('/create', authentificateToken
                     , userController.verifyUserToken
                     , userController.getDataUsers_Id
                     , conversationController.create);

router.post('/delete', authentificateToken
                , conversationController.delete);

// Post things on conversations - conversation_id
router.post('/send'  , authentificateToken
                , conversationController.send);

// Get data of conversation - token - 10 by 10
router.post('/getConvs'  , authentificateToken
                    , conversationController.getConvs);

// Get data of conversation - token - 10 by 10
router.post('/getMessages', authentificateToken
                          , conversationController.getMessages);

module.exports = router;