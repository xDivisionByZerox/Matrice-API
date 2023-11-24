const view = require('../models/view.model');
const mongoose = require('mongoose');

module.exports.view = async (req, res) => {
    if(req.user){
        if(req.post_data){
            if(!req.view_data){
                v = new view( {userId : req.user._id , postId : req.post_data._id } );
                await v.save();
                res.status(200).json(v);
            }
            else {
                res.status(400).send("View already exists : view");
            }
        }
        else{
            res.status(400).send("Post don't exists : post_id");
        }
    }
};

//                              //
//-------- MiddleWares----------//
//                              //

// Verify user exists - 
module.exports.verifyExists = async (req, res, next) => {
    if(req.user && req.post_data){
        req.view_data = await view.findOne({ userId : req.user._id , postId : req.post_data._id });
    }
    next();
};

// req.user(authenticate) - req.user_token_data (userController.verifyUserTokenThread) - req.thread_data (thread.verifyExists)
module.exports.get100latest = async(req, res, next) => {
    if(req.user && req.user_token_data && req.thread_data){
        req.views_ids = await view.find({ userId : req.user_token_data._id})
            .sort({creation : -1})
            .limit(100)
            .exec();
    }
    next();
}