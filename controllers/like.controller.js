const like = require('../models/like.model');
const mongoose = require('mongoose');

module.exports.like = async (req, res) => {
    if(req.post_data && !req.like_data){
        link = {
            userId : req.user._id,
            postId : req.post_data._id
        }
        l = new like(link);
            await l.save()
            .then(() => {         
            res.status(200).send('Liked');   
        })
            .catch((err) => {
        });
    }
    else{
        res.status(400).send("Already liked");
    }
}


module.exports.dislike = async (req, res) => {
    console.log(req.post_data);
    if(req.post_data && req.like_data){
        link = {
            userId : req.user._id,
            postId : req.post_data._id
        }
        await like.deleteMany(link)
        .then(() => {         
            res.status(200).send('Disliked');   
        })
        .catch((err) => {
            res.status(500).send('Internal Server Error');
        });
    }
    else{
        res.status(400).send("Already disliked");
    }
}

// Need to test if the 
module.exports.doIlike = async (req, res) => {
    const { post_id } = req.body;
    if(req.post_data){
        const like_data = await like.findOne({ userId : req.user._id, postId : post_id}).exec();
        if(like_data){
            res.status(200).json({liked : true});
        }
        else{
            res.status(200).json({liked : false});
        }
    }
    else{
        res.status(400).send("Post don't exists");
    }
}

//                              //
//-------- MiddleWares----------//
//                              //
module.exports.verifyExists = async(req, res, next) => {
    const { post_id } = req.body;
    if(post_id && mongoose.Types.ObjectId.isValid(post_id)){
        req.like_data = await like.findOne({ userId : req.user._id, postId : post_id});
    }
    next();
}

// req.user(authenticate) - req.user_token_data (userController.verifyUserTokenThread) - req.thread_data (thread.verifyExists)
module.exports.get100latest = async(req, res, next) => {
    if(req.user && req.user_token_data && !req.thread_data){
        req.likes_ids = await like.find({ userId : req.user_token_data._id})
        .sort({creation : -1})
        .limit(100)
        .exec();
        if(req.likes_ids.length < 5){
            req.SVD = true;
            req.likes_ids_SVD = await like.find()
            .sort({creation : -1})
            .limit(100)
            .exec();
            req.ids = req.likes_ids_SVD.map(document => document.userId);
        }
    }
    next();
}

module.exports.get100latestfromUsers = async(req, res, next) => {
    if(req.user && req.user_token_data && req.users_data){
        req.likes_users = [];
        for(let index = 0 ; index < req.users_data.length ; index = index + 1){
            req.likes_users[index] = await like.find({ userId : req.users_data[index]._id})
            .sort({creation : -1})
            .limit(50)
            .exec();
        }
    }
    next();
}