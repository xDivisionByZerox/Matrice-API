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
// req.post_data(post) - req.owner_data(user) -  
module.exports.buyPost = async(req, res) => {
    if(req.post_data){
        if(req.owner_data){
            if(req.user_token_data._id != req.post_data.ownerId){
                if(req.validate_transaction){
                    await post.findOneAndUpdate({ _id : req.post_data._id}, {$set : {ownerId : req.user_token_data._id}});
                    res.status(200).send('Post bought : success');
                }
                else{
                    res.status(400).send('Not enaugh coins');
                }
            }
            else{
                res.status(400).send('Already owned');
            }
        }
        else{
            res.status(400).send('Owner no longer exists');
        }
    }
    else{
        res.status(400).send('No post found : post_id');
    }
}

// Need to verify owner - req.owner
module.exports.enablePost = async(req, res) => {
    if(req.post_data){
        if(req.owner){
            await post.findOneAndUpdate({_id : req.post_data._id}, { $set: { buy : true } });
            res.status(200).send("Post buy : enabled");
        }
        else{
            res.status(401).send('Not the owner');
        }
    }
    else{
        res.status(400).send('No post found : post_id');
    }
}

// Need to verify owner - - req.owner
module.exports.disablePost = async(req, res) => {
    if(req.post_data){
        if(req.owner){
            await post.findOneAndUpdate({_id : req.post_data._id}, { $set: { buy : false } }); 
            res.status(200).send("Post buy : disabled");
        }
        else{
            res.status(401).send('Not the owner');
        }
    }
    else{
        res.status(400).send('No post found : post_id');
    }
}

//                              //
//-------- MiddleWares----------//
//                              //
module.exports.verifyExists = async(req, res, next) => {
    const { post_id } = req.body;
    if(post_id && mongoose.Types.ObjectId.isValid(post_id)){
        req.post_data = await post.findOne({ _id : post_id }).exec();
    }
    next();
}

// Need to verify posts - req.post_data - if the owner req.user
module.exports.verifyOwner = async (req, res, next) =>{
    if(req.post_data){
        req.owner = post.findOne({ ownerId : req.user._id,  _id : req.post_data._id});
    }
    next();
}

// Need to verify if like exists - req.post
module.exports.AddLike = async(req, res, next) => {
    const { post_id } = req.body;
    if(!req.like_data){
        req.post_data = await post.findOneAndUpdate({_id : post_id}, {$inc : {price : 1, likes : 1}});
    }
    else{
        req.post_data = await post.findOne({_id : post_id});
    }
    next();
}

// Need to verify if like exists - req.like_data
module.exports.AddDislike = async(req, res, next) => {
    const { post_id } = req.body;
    if(req.like_data){
        req.post_data = await post.findOneAndUpdate({_id : post_id}, {$inc : {price : -1, likes : -1}});
    }
    else{
        req.post_data = await post.findOne({_id : post_id});
    }
    next();
}