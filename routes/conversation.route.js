// Router init
const router = require("express").Router();

// Call controller
const conversationController = require("../controllers/conversation.controller");
const userController = require("../controllers/user.controller");
const { authentificateToken } = require("../utils/auth.js");

// Manage the conversation
router.post('/create', authentificateToken
                     , userController.getDataUsers_Id
                     , conversationController.create);

router.post('/delete', authentificateToken
                     , userController.verifyUserTokenThread
                     , conversationController.delete);

// Post things on conversations - conversation_id
router.post('/send' , authentificateToken
                    , userController.verifyUserTokenThread  // token    -> req.user_token_data
                    , conversationController.verifyExists   // conv_id  -> req.conv_data
                    , conversationController.send);

// Get data of conversation - token - 10 by 10
router.post('/getConvs' , authentificateToken
                        , userController.verifyUserTokenThread
                        , conversationController.MiddleGetConvs
                        , conversationController.getConvs);

// Get data of conversation - token - 10 by 10
router.post('/getMessages'  , authentificateToken
                            , conversationController.verifyExists
                            , conversationController.getMessages);

module.exports = router;