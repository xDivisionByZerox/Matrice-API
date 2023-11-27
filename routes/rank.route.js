const router = require("express").Router();

const rankController = require("../controllers/rank.controller");
const userController = require("../controllers/user.controller");
const { authentificateToken } = require("../utils/auth");

router.post('/create', rankController.addRank);

router.post('/get', rankController.get);

router.post('/buy', authentificateToken
                  , rankController.verifyExists
                  , userController.verifyUserTokenThread);

module.exports = router;