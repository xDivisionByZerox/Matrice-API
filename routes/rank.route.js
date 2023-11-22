const router = require("express").Router();

const rankController = require("../controllers/rank.controller");
const { authentificateToken } = require("../utils/auth");

router.post('/create', authentificateToken, rankController.addRank);

module.exports = router;