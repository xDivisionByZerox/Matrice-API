const bcrypt = require("bcrypt");
const user =  require('../models/user.model.js');
const mongoose = require('mongoose');

const {generateAccessToken} = require("../utils/auth.js");

module.exports.me = async (req, res) => {
    if(req.user){
        user_data = await user.findOne({ _id : req.user._id }).select("-password").exec();
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
    if(req.body.birthday){req.body.birthday = new Date(req.body.birthday)}
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

module.exports.search = async(req, res) => {
    if(req.user){
        if(req.body.user_search){
            if(req.body.users_id){
                var users_data = await user
                .find({
                    nickname: { $regex: String(req.body.user_search) , $options: 'i' },
                    _id: { $nin: req.body.users_id }
                })
                .sort({ subscribes: -1, coins: -1 })
                .limit(req.body.users_id.length + 10)
                .select("_id nickname picture")
                .exec();
                res.status(200).json(users_data);
            }
            else{
                var users_data = await user
                .find({
                    nickname: { $regex: req.user_search, $options: 'i' }
                })
                .sort({ subscribes: -1, coins: -1 })
                .limit(10)
                .select("_id nickname picture")
                .exec();
                res.status(200).json(users_data);
            }
        }  
        else{
            res.status(400).send("Aucun mots clés entrés");
        }
    }
}

module.exports.group = async(req, res) => {
    if(req.user){
        if(req.body.users_id){
            let { users_id } = req.body;
            try{
                users_id = users_id.filter((id) => mongoose.Types.ObjectId.isValid(id));
                var users = await user.find({ _id : {$in : users_id}})
                            .select("-password");
                res.status(200).json(users);
            }
            catch (err){
                console.log(err)
                res.status(500).send("Error : user getGroup")
            }
        }
        else{
            res.status(400).send("No users specified : users_id")
        }
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
            await user.findOneAndUpdate({ _id: req.user._id }, {$inc : { subscribed : -1 }});
        }
        if(user_id){
            await user.findOneAndUpdate({ _id: user_id }, {$inc : {subscribes : -1 }});
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
    if(req.user._id){
        if(req.post_data){
            req.user_token_data = await user.findOne({_id : req.user._id}).select('-password');
        }
    }
    next();
}

//MiddleWare who vrify the user exists - need req.user.id
module.exports.verifyUserTokenThread = async(req, res, next) => {
    if(req.user._id){
        req.user_token_data = await user.findOne({_id : req.user._id}).select('-password');
    }
    next();
}

//MiddleWare who exchange coins between req.user and req.owner_data
module.exports.buyTransaction = async(req, res, next) => {
    if(req.post_data && req.owner_data && req.user_token_data){
        if(req.user_token_data._id != req.post_data.ownerId){
            if(req.user_token_data.coins >= ( req.post_data.price * (1 + process.env.taxe) )){
                try{
                    await user.findOneAndUpdate({ _id : req.user_token_data._id }, 
                        { $inc : {coins : -( req.post_data.price * (1 + process.env.taxe))} });
                    await user.findOneAndUpdate({ _id : req.owner_data._id }, 
                        { $inc : {coins : req.post_data.price} });
                    req.validate_transaction = true;
                }
                catch(err) {
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
    }
    else{
        req.validate_transaction = false;
    }
    next();
}

// Middleware - Get users in array users_ids
module.exports.getDataUsersId = async (req,res,next) => {
    if(req.user && req.ids){
        try{
            req.users_data = await user.find({ _id : { $in: req.ids } });
        }       
        catch(err){
            console.log(err);
        }
    }
    next();
}

//
module.exports.addPost = async (req, res, next) => {
    if(req.user && !req.mother_data){
        await user.findOneAndUpdate({ _id: req.user._id }, {$inc : { posts : 1 }});
    }
    next();
}

// req.user_token_data --- 
module.exports.buyRankTransaction = async(req, res, next) => {
    if(req.user && req.user_token_data && req.rank_data){
        if((req.user_token_data.coins >= req.rank_data.price) && (req.rank_data.num == (req.user_token_data.rank + 1))){
            try{
                await user.findOneAndUpdate({ _id : req.user_token_data._id}, 
                                            {$set : {num : req.rank_data.num}, $inc : {coins : -req.rank_data.price}});
                req.validate_transaction = true;
            }
            catch(err){
                req.validate_transaction = false;
            }
        }
        else{
            req.validate_transaction = false;
        }
    }
    next();
}