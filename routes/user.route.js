// Router init
const router = require("express").Router();

// Call controller
const userController = require("../controllers/user.controller")
const { authentificateToken } = require("../utils/auth.js");


// Connect user - return token
router.post('/login', userController.login);

// Create user - return if registered
router.post('/signup', userController.signup);

// Return user data by nickname
router.post('/', userController.getById);

// Modify password - Take token
router.post('/password',authentificateToken, 
                        userController.modifyPassword);

// Modify user profile 
router.post('/update',  authentificateToken,
                        userController.updateUser);

module.exports = router;