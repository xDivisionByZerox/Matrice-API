const follower = require('../models/follower.model');
const { default: mongoose } = require('mongoose');

module.exports.follow = async (req, res) => {
    if(req.user){
        if(req.user_data){
            if(!req.follower_data){
                link = {
                    userA : req.user._id,
                    userB : req.body.user_id,
                }
                const newFollower = new follower(link);
                await newFollower.save();
                res.status(200).json("Follow : relationship created successfully");
            }
            else {
                res.status(400).json("Follow : relationship already exists");
            }
        }
        else{
            res.status(400).json("Follow : user don't exist");
        }   
    } 
};

module.exports.unfollow = async (req, res) => {
    if(req.user){
        if(req.user_data){
            if(req.follower_data){
                link = {
                    userA : req.user._id,
                    userB : req.body.user_id,
                }
                await follower.deleteMany(link);
                res.status(200).json("Unfollow: relationship deleted successfully");
            }
            else {
                res.status(400).json("UnFollow : relationship don't exists");
            }
        }
        else{
            res.status(400).json("UnFollow : user don't exist");
        }    
    }
};

module.exports.followed = async (req, res) => {
    if(req.user){
        if(req.users_data){
            res.status(200).json(req.users_data);
        }
        else{
            res.status(400).json({});
        }
    }
};

module.exports.followers = async (req, res) => {
    if(req.user){   
        if(req.users_data){
            res.status(200).json(req.users_data);
        }
        else{
            res.status(200).json({});
        }
    }
};

module.exports.doIfollow = async (req, res) => {
    if(req.user){
        if(req.user_data){
            if(req.follower_data){
                res.status(200).json({Followed : true});
            }
            else {
                res.status(200).json({Followed : false});
            }
        }
        else{
            res.status(400).json("UnFollow : user don't exist");
        }  
    }  
};  



//                              //
//-------- MiddleWares----------//
//                              //
// Verify if user exists before - userController.verifyExists
module.exports.verifyExists = async (req,res,next) => {
    if(req.user._id && req.user_data){
        link = {
            userA : req.user._id,
            userB : req.body.user_id,
        }
        req.follower_data = await follower.findOne(link);
    }
    next();
}

module.exports.getTokenFollowsIds = async (req, res, next) => {
    if(req.user){
    }
    next();
}

module.exports.Followed10others = async (req, res, next) => {
    const {users_id} = req.body
    if(req.user){
        if(users_id && users_id.length > 0){
            const areAllIdsValid = users_id.filter((id) => mongoose.Types.ObjectId.isValid(id));
            req.followed_ids = await follower.find({userA : req.user._id, userB : { $nin: areAllIdsValid }})
                                   .limit(areAllIdsValid.length + 10);
        }
        else {
            req.followed_ids = await follower.find({userA : req.user._id})
                                   .limit(10);
        }
        if(req.followed_ids && req.followed_ids.length > 0){
            req.ids = (req.followed_ids).map(document => document.userB);
        }
    }
    next();
}

module.exports.Follower10others = async (req, res, next) => {
    const {users_id} = req.body
    if(req.user){
        if(users_id && users_id.length > 0){
            const areAllIdsValid = users_id.filter((id) => mongoose.Types.ObjectId.isValid(id));
            req.followed_ids = await follower.find({userB : req.user._id, userA : { $nin: areAllIdsValid }})
                                   .limit(areAllIdsValid.length + 10);
        }
        else {
            req.followed_ids = await follower.find({userB : req.user._id})
                                   .limit(10);
        }
        if(req.followed_ids && req.followed_ids.length > 0){
            req.ids = (req.followed_ids).map(document => document.userA);
        }
    }
    next();
}