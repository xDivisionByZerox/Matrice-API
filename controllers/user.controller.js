const bcrypt = require("bcrypt");
const user =  require('../models/user.model.js');
const mongoose = require('mongoose');

const {generateAccessToken} = require("../utils/auth.js");

module.exports.me = async (req, res) => {
    if(req.user){
        user_data = user.findOne({ _id : req.user._id }).select("mail password").exec();
        if(user_data){
            res.status(200).json(user_data);
        }
        else{
            res.status(400).send("User not found : token");
        }
    }
}

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

// Get data from user : thanks to his Nickname
module.exports.getByNickname = async (req, res) => {
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

// Get data from user : thanks to his id
module.exports.getById = async (req, res) => {
    if(req.user_data){
        res.status(200).json(req.user_data);
    }
    else{
        res.status(400).send("User don't exists : user_id");
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

// MiddleWare who needs userController.verify and followerController.verify
module.exports.sub = async(req, res, next) => {
    if(!req.follower_data){
        const { user_id } = req.body;
        if(req.user_data){
            await user.findOneAndUpdate({ _id: user_id }, {$inc : {subscribes : 1 }});
            await user.findOneAndUpdate({ _id: req.user._id }, {$inc : { subscribed : 1 }});
        }
    }
    next();
}

// MiddleWare who needs userController.verify
module.exports.unSub = async(req, res, next) => {
    if(req.follower_data){
        const { user_id } = req.body;
        if(req.user_data){
            await user.findOneAndUpdate({ _id: user_id }, {$inc : {subscribes : -1 }});
            await user.findOneAndUpdate({ _id: req.user._id }, {$inc : { subscribed : -1 }});
        }
    }
    next();
}

// MiddleWare who vrify the post exists - req.post_data - owner
module.exports.verifyOwner = async(req, res, next) => {
    if(req.post_data){
        req.owner_data = user.findOne({_id : req.post_data.ownerId});
    }
    next();
}

//MiddleWare who vrify the user exists - need req.user.id
module.exports.verifyUserToken = async(req, res, next) => {
    if(req.user.id){
        if(req.post_data){
            req.user_token_data = user.findOne({_id : req.user._id});
        }
    }
    next();
}

//MiddleWare who exchange coins between req.user and req.owner_data
module.exports.buyTransaction = async(req, res, next) => {
    if(req.post_data && req.owner_data && req.user_token_data){
        if(req.user_token_data._id != req.post_data.ownerId){
            if(req.user_token_data.coins >= ( req.post_data.price * (1 + process.env.taxe) )){
                await user.findOneAndUpdate({ _id : req.user_token_data._id }, 
                                            { $inc : {coins : -( req.post_data.price * (1 + process.env.taxe))} });
                await user.findOneAndUpdate({ _id : req.owner_data._id }, 
                                            { $inc : {coins : ( req.post_data.price * (1 + process.env.taxe))} });
                req.validate_transaction = true;
            }
            else{
                req.validate_transaction = false;
            }
        }
        else{
            req.validate_transaction = false;
        }
    }
    else{
        req.validate_transaction = false;
    }
    next();
}