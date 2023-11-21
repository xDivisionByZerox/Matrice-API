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
            res.status(201).send('Liked');   
        })
            .catch((err) => {
        });
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
            res.status(201).send('Disiked');   
        })
        .catch((err) => {
            res.status(500).send('Internal Server Error');
        });
    }
}

module.exports.doIlike = async (req, res) => {
    const { post_id } = req.body;
    if(req.post_data){
        const like_data = await like.findOne({ userId : req.user._id, postId : post_id}).exec();
        if(like_data){
            res.status(200).send("Liked");
        }
        else{
            res.status(200).send("Not liked");
        }
    }
}


//                              //
//-------- MiddleWares----------//
//                              //
module.exports.verifyExists = async(req, res, next) => {
    const { post_id } = req.body;
    try{
        const like_data = await like.findOne({ userId : req.user._id, postId : post_id}).exec();
        req.like_data = like_data;
        if(!like_data){
            res.status(401).send("Not liked : middleware");
        }
        next();
    }catch(err){
        res.status(500).send('Internal Server Error');
    }
}

module.exports.verifyDontExists = async(req, res, next) => {
    const { post_id } = req.body;
    try{
        const like_data = await like.findOne({ userId : req.user._id, postId : post_id}).exec();
        req.like_data = like_data;
        if(like_data){
            res.status(401).send("Already liked : middleware");
        }
        next();
    }catch(err){
        res.status(500).send('Internal Server Error');
    }
}