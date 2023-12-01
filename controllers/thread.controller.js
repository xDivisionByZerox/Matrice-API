const thread = require('../models/thread.model');
const post = require('../models/post.model');

const { primaryTags } = require("../utils/stat");

module.exports.createThread = async (req, res) => {
    if(req.user){
        if(req.user_token_data){
            if(!req.thread_data){
                if(req.posts_data && (req.posts_data.length >= 5)){
                    try {
                        var tagsUser = await primaryTags(req.posts_data);
                        const t = new thread({ name : req.user_token_data.mail , tags : tagsUser ,posts : []});
                        const savedThread = await t.save();
                        res.status(201).json(savedThread);
                    } catch (error) {
                        res.status(500).json({ error: error.message });
                    }
                }
                else {
                    try {
                        const t = new thread({ name : req.user_token_data.mail , tags : [] ,posts : []});
                        const savedThread = await t.save();
                        res.status(201).json(savedThread);
                    } catch (error) {
                        res.status(500).json({ error: error.message });
                    }
                }
            }
            else{
                res.status(400).send("Thread already exists");
            }
        }
        else{
            res.status(400).send("User don't exists : token error");
        }
    }
};

module.exports.deleteThread = async (req, res) => {
    if(req.user){
        if(req.user_token_data){
            if(req.thread_data){
                try {
                    await thread.findByIdAndDelete( req.thread_data._id );
                    res.status(200).send('Thread deleted successfully');
                } catch (error) {
                    res.status(500).json("error");
                }
            }
            else{
                res.status(400).send("Thread don't exists");
            }
        }
        else{
            res.status(400).send("User don't exists : token error");
        }
    }
};

module.exports.feedThread = async (req, res) => {
    if(req.user){
        if(req.user_token_data){
            if(req.thread_data){
                if(req.thread_data.tags.length == 0){
                    try{
                        var new_posts = await post.aggregate([
                                        { $match: { _id: { $nin: req.thread_data.posts } } },
                                        { $sample: { size: 5 } },
                                        { $sort: { creation: -1 } }
                                        ]).exec();
                        const new_posts_ids = new_posts.map(document => document._id);                
                        await thread.findByIdAndUpdate(
                            { _id : req.thread_data._id},
                            { $push: { posts: { $each: new_posts_ids } } },
                        );
                        res.status(200).json(new_posts);
                    }
                    catch(err){
                        console.log(err);
                        res.status(500).send("Thread error :");
                    }
                }
                else{
                    const tagsUser = req.thread_data.tags.map(subArray => subArray[0]);
                    try{
                        var new_posts = await post.aggregate([
                                        { $match: { _id: { $nin: req.thread_data.posts }, tags : { $in : tagsUser}}},
                                        { $sample: { size: 5 } },
                                        { $sort: { creation: -1 } }
                                        ]).exec();
                        const new_posts_ids = new_posts.map(document => document._id);                
                        await thread.findByIdAndUpdate(
                            { _id : req.thread_data._id},
                            { $push: { posts: { $each: new_posts_ids } } },
                        );
                        res.status(200).json(new_posts);
                    }
                    catch(err){
                        res.status(500).send("Thread error :");
                    }
                }
            }
            else{
                res.status(400).send("Thread don't exists");
            }
        }
        else{
            res.status(400).send("User don't exists : token error");
        }
    }
};

//                              //
//-------- MiddleWares----------//
//                              //

// Need req.user_token_data - userController.verifyUserToken
module.exports.verifyExists = async (req, res, next) => {
    if(req.user && req.user_token_data){
        req.thread_data = await thread.findOne({ name : req.user_token_data.mail });
    }
    next();
}