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
module.exports.verifyExists = async (req, res, next) => {
    if(req.user && req.post_data){
        req.view_data = await view.findOne({ userId : req.user._id , postId : req.post_data._id });
    }
    next();
};