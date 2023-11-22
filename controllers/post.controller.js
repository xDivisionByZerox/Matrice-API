const post =  require("../models/post.model");
const mongoose = require('mongoose');

module.exports.getPost = async(req, res) => {
    const { post_id } = req.body;
    try{
        const data = await post.findOne({ _id: post_id }).exec();
        if(data){
            res.status(200).json(data);
        }
        else{
            res.status(400).send('No post found : post_id');
        }
    }catch(err){
        res.status(500).send('Internal Server Error');
    }
}

module.exports.createPost = async(req, res) => {
    const p = new post(req.body);
    p.creatorId = req.user._id;
    p.ownerId = req.user._id;
    p.save()
        .then(() => {
            res.status(200).send("Posted : success");
        })
        .catch((err) => {
            res.status(401).send("Invalid entries");
        });
}

module.exports.buyPost = async(req, res) => {
    
}

module.exports.enablePost = async(req, res) => {
}

module.exports.disablePost = async(req, res) => {
}

//                              //
//-------- MiddleWares----------//
//                              //
module.exports.verifyExists = async(req, res, next) => {
    const { post_id } = req.body;
    try{
        if(post_id && mongoose.Types.ObjectId.isValid(post_id)){
            const post_data = await post.findOne({ _id : post_id }).exec();
            if(!post_data){
                res.status(401).json("Post : middleware : post don't exists ");
            }
            else{
                req.post_data = post_data;
            }
        }
        else{
            res.status(404).json("Post Id not specified or not in the good format");
        }
        next();
    }catch(err){
        res.status(500).send('Internal Server Error');
    }
}
 
// Need to verify if like exists - req.like_data
module.exports.AddLike = async(req, res, next) => {
    const { post_id } = req.body;
    if(!req.like_data){
        try{
            req.post_data = await post.findOneAndUpdate({_id : post_id}, {$inc : {likes : 1}});
        }catch(err){
            res.status(500).send('Internal Server Error');
        }
    }
    next();
}

// Need to verify if like exists - req.like_data
module.exports.AddDislike = async(req, res, next) => {
    const { post_id } = req.body;
    if(req.like_data){
        try{
            req.post_data = await post.findOneAndUpdate({_id : post_id}, {$inc : {likes : -1}});
        }catch(err){
            res.status(500).send('Internal Server Error');
        }
    }
    next();
}