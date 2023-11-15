const bcrypt = require("bcrypt")
const user =  require('../models/user.model.js');

module.exports.login = (req, res) => {
    const {email, pwd } = req.body 
    console.log(email, pwd)
    res.json("{}");
};