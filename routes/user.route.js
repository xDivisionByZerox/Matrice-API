// Router init
const router = require("express").Router();

// Call controller
const userController = require("../controllers/user.controller")

router.post('/login', userController.login);
router.post('/signup', userController.signup);
router.post('/', userController.getById);

module.exports = router;