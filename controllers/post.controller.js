const post =  require("../models/post.model");
const mongoose = require('mongoose');

module.exports.getPost = async(req, res) => {
    if(req.post_data){
        res.status(200).json(req.post_data);
    }
    else {
        res.status(400).send("Post not found : post_id");
    }
}

module.exports.createPost = async(req, res) => {
    if(req.user) {
        p = new post(req.body);
        p.creatorId = req.user._id;
        p.ownerId = req.user._id;
        await p.save()
        .then(() => {
            res.status(200).send("Posted : success");
        })
        .catch((err) => {
            console.log(err);
            res.status(401).send("Invalid entries");
        });
    }
}

// req.post_data(post) - req.owner_data(user) -  
module.exports.buyPost = async(req, res) => {
    if(req.user){
        if(req.post_data){
            if(req.owner_data){
                if(req.user_token_data){
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
                    res.status(400).send('User no longer exists');
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

// Send ten last user posts
module.exports.profile = async(req, res) => {
    if(req.user_data){
        if(req.post_data){
            posts_data = await post.find({
                creation: { $lt: new Date(req.post_data.creation) },
                $or: [
                    { ownerId: req.user_data._id },
                    { creatorId: req.user_data._id }
                ],
                motherId : null 
            })
            .sort({creation : -1})
            .limit(10)
            .exec();
            res.status(200).json(posts_data)
        }
        else{
            posts_data = await post.find({
                $or: [
                    { ownerId: req.user_data._id },
                    { creatorId: req.user_data._id }
                ],
                motherId : null 
            })
            .sort({creation : -1})
            .limit(10)
            .exec();
            res.status(200).json(posts_data)
        }
    }
    else{
        res.status(400).send("User don't exists : user_id");
    }
}

// Send posts attached to ids stored in list - posts_id
module.exports.group = async(req, res) => {
    const {posts_id} = req.body;
    if(posts_id && posts_id.length > 0){
        const areAllIdsValid = posts_id.every((id) => mongoose.Types.ObjectId.isValid(id));
        if(areAllIdsValid){
            const posts_data = await post.find({ _id: { $in: posts_id } });
            res.status(200).json(posts_data);
        }
        else{
            res.status(400).send("Post id not in good format");
        }
    }
    else{
        res.status(400).send("posts_id not specified or no ids");
    }
}

module.exports.comment = async(req, res) => {
    const { posts_id } = req.body;
    if(req.post_data){
        if(posts_id && posts_id.length > 0){
            areAllIdsValid = posts_id.filter((id) => mongoose.Types.ObjectId.isValid(id));
            try{
                const comments = await post.find({ motherId : req.post_data._id, _id : { $nin: posts_id }})
                                            .sort({ likes : 1 } )
                                            .limit(areAllIdsValid.length + 10);
                res.status(200).json(comments);
            }
            catch(err){
                console.log(err);
                res.status(500).send("Error");
            }
        }
        else{
            try{
                const comments = await post.find({ motherId : req.post_data._id })
                                        .sort({ likes : 1 } )
                                        .limit(10);         
                res.status(200).json(comments);
            }
            catch(err){
                res.status(500).send("Error");
            }
        }
    }
    else{
        res.status(400).send("Post doesn't exists : comment")
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
    if(post_id && mongoose.Types.ObjectId.isValid(post_id)){
        if(!req.like_data){
            req.post_data = await post.findOneAndUpdate({_id : post_id}, {$inc : {price : 1, likes : 1}});
        }
        else{
            req.post_data = await post.findOne({_id : post_id});
        }
    }
    next();
}

// Need to verify if like exists - req.like_data
module.exports.AddDislike = async(req, res, next) => {
    const { post_id } = req.body;
    if(post_id && mongoose.Types.ObjectId.isValid(post_id)){
        if(req.like_data){
            req.post_data = await post.findOneAndUpdate({_id : post_id}, {$inc : {price : -1, likes : -1}});
        }
        else{
            req.post_data = await post.findOne({_id : post_id});
        }
    }
    next();
}

// View : Like --> get100latest each --- care this middleware return req.posts_data
module.exports.postsLikedViewed = async(req, res, next) => {
    if(req.views_ids && req.likes_ids){
        req.ids = (req.views_ids).concat(req.likes_ids);
        req.ids = (req.ids).map(document => document.postId);
    }
    else if(req.views_ids){
        req.ids = (req.views_ids).map(document => document.postId);
    }
    else if(req.likes_ids){
        req.ids = (req.likes_ids).map(document => document.postId);
    }
    if(req.ids){
        try{
            req.posts_data = await post.find({ _id : { $in: req.ids } });
        }       
        catch(err){
            console.log(err);
        }
    }
    next();
}

// Validate post
module.exports.verifyModelPost = async(req, res, next) => {
    p.creatorId = req.user._id;
    p.ownerId = req.user._id;
    if(req.body.motherId) { p.ownerId = req.body.motherId }
    p = new post(req.body);
    if(p.validate()){
        req.post_validate = true;
        req.post_tosave = p; 
    }
    next();
}

// Validate mother-post - add a comment stat to it
module.exports.verifyMotherId = async(req, res, next) => {
    const { motherId } = req.body;
    if(req.user){
        if(motherId && mongoose.Types.ObjectId.isValid(motherId)){
            try{
                req.mother_data = post.findOneAndUpdate({ _id : motherId}, { $inc : {comments : 1 }})
            }
            catch(err){
                console.log(err);
            }
        }
    }
    next();
}