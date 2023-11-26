const follower = require('../models/follower.model');

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
module.exports.doIfollow = async (req, res) => {
    if(req.user){
        if(req.user_data){
            if(req.follower_data){
                res.status(200).json("Followed");
            }
            else {
                res.status(200).json("UnFollowed");
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
    if(req.user_data){
        link = {
            userA : req.user._id,
            userB : req.body.user_id,
        }
        req.follower_data = await follower.findOne(link);
    }
    next();
}

module.exports.getTokenFollowsIds = async (req,res,next) => {
    if(req.user){
    }
    next();
}