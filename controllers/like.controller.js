const like = require('../models/like.model');
const mongoose = require('mongoose');

module.exports.like = async (req, res) => {
    if(req.post_data && !req.like_data){
        link = {
            userId : req.user._id,
            postId : req.body.post_id
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
    if(req.post_data && req.like_data){
        link = {
            userId : req.user._id,
            postId : req.body.post_id
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
    const like_data = await like.findOne({ userId : req.user._id, postId : post_id}).exec();
    req.like_data = like_data;
    next();
}

// req.user(authenticate) - req.user_token_data (userController.verifyUserTokenThread) - req.thread_data (thread.verifyExists)
module.exports.get100latest = async(req, res, next) => {
    if(req.user && req.user_token_data && req.thread_data){
        req.likes_ids = await like.find({ userId : req.user_token_data._id})
        .sort({creation : -1})
        .limit(100)
        .exec();
    }
    next();
}