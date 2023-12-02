// Router init
const router = require("express").Router();

// Call controller
const conversationController = require("../controllers/conversation.controller");
const userController = require("../controllers/user.controller");
const { authentificateToken } = require("../utils/auth.js");

module.exports = router;