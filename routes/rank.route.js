const router = require("express").Router();

const rankController = require("../controllers/rank.controller");
const userController = require("../controllers/user.controller");
const { authentificateToken } = require("../utils/auth");

router.post('/create', rankController.addRank);

router.post('/get', rankController.get);

router.post('/buy', authentificateToken                     // req.user
                  , rankController.verifyExists             // req.rank_data
                  , userController.verifyUserTokenThread    // req.user_token_data
                  , userController.buyRankTransaction       // req.validate_transaction
                  , rankController.buy);

module.exports = router;