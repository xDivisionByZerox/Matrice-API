const bcrypt = require("bcrypt")
const user =  require('../models/user.model.js');


module.exports.signup = (req, res) => {
}

module.exports.login = (req, res) => {
    const {email, pwd } = req.body;
    res.json("{}");
};