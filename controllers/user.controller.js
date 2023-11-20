const bcrypt = require("bcrypt");
const user =  require('../models/user.model.js');

const {generateAccessToken} = require("../utils/auth.js");
const { default: mongoose } = require("mongoose");

// Create user : signup in application
module.exports.signup = (req, res) => {
    const u = new user(req.body);
    // Save the user object to the database
    u.save()
        .then(() => {
            res.status(200).send("Registered");
        })
        .catch((err) => {
            res.status(401).send("Invalid entries");
        });
}

// Connect the user to his account through a token : Bearer token
module.exports.login = async (req, res) => {
    const { mail, password } = req.body;
    try{
        const data = await user.findOne({"mail" : mail}).select("mail password").exec();
        if(data){
            if (await bcrypt.compare(password, data.password)){
                credentials ={
                    _id : data._id,
                    mail : data.mail,
                    password : data.password, 
                };
                token_data = generateAccessToken(credentials);
                res.status(200).json({"token" : token_data});
            }
            else{
                res.status(401).send('Invalid password');
            }
        }
        else{
            res.status(401).send('Invalid email');
        }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error');
    }
};

// Get data from user : thanks to his id
module.exports.getById = async (req, res) => {
    const { nickname } = req.body;
    try{
        const data = await user.findOne({ nickname: nickname }).select('-password').exec();
        if(data){
            res.status(200).json(data);
        }
        else{
            res.status(404).send('No user found : nickname');
        }
    }catch(err){
        res.status(500).send('Internal Server Error');
    }
}