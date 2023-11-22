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

// Modify password : token
module.exports.modifyPassword = async (req, res) => {
    const {password, newpassword} = req.body;
    try{
        const data = await user.findOne({_id : req.user._id}).select("mail nickname password").exec();
        if(await bcrypt.compare(password, data.password)){
            await user.updateOne({_id : req.user._id}, {password : newpassword});
            res.status(200).send("Password modified");
        }
        else{
            res.status(401).send('Wrong password : ancient');
        }
    }catch(err){
        res.status(500).send('Internal Server Error');
    }
}

// Update user bio + user picture
module.exports.updateUser = async(req, res) => {
    const {picture, bio} = req.body;
    try{
        if(picture && bio){
            await user.findOneAndUpdate({ _id: req.user._id }, { $set: { picture: picture, bio: bio } });
            res.status(200).send("Modified : picture : bio");
        }
        else if(picture){
            await user.findOneAndUpdate({_id : req.user._id}, {picture : picture});
            res.status(200).send("Modified : picture");
        }
        else if(bio){
            await user.findOneAndUpdate({_id : req.user._id},{bio : bio});
            res.status(200).send("Modified : bio");
        }
        else{
            res.status(401).send("Invalid or unspecified");
        }
    }catch(err){
        res.status(500).send('Internal Server Error');
    }
}

//                              //
//-------- MiddleWares----------//
//                              //
// MiddleWare who vrify the user exists - req.body.user_id
module.exports.verifyExists = async(req, res, next) => {
    const { user_id } = req.body;
    if(user_id && mongoose.Types.ObjectId.isValid(user_id)){
        const data = await user.findOne({ _id : user_id }).select('-password').exec();
        req.user_data = data;
    }
    next();
}

// Verify 
module.exports.AddLike = async(req, res, next) => {
    if(!req.like_data){
        await user.findOneAndUpdate({ _id: req.post_data.ownerId }, {$inc : {coins : 0.5}});
    }
    next();
}

module.exports.AddDislike = async(req, res, next) => {
    if(req.like_data){
        await user.findOneAndUpdate({ _id: req.post_data.ownerId }, {$inc : { coins : -0.5 }});
    }
    next();
}

module.exports.Sub = async(req, res, next) => {
    const { user_id } = req.body;
    if(req.user_data){
        //await user.findOneAndUpdate({ _id: req.post_data.ownerId }, {$inc : { coins : -0.5 }});
        //await user.findOneAndUpdate({ _id: req.post_data.ownerId }, {$inc : { coins : -0.5 }});
    }
    next();
}

module.exports.UnSub = async(req, res, next) => {
    const { user_id } = req.body;
    if(req.user_data){
        //await user.findOneAndUpdate({ _id: req.post_data.ownerId }, {$inc : { coins : -0.5 }});
        //await user.findOneAndUpdate({ _id: req.post_data.ownerId }, {$inc : { coins : -0.5 }});
    }
    next();
}