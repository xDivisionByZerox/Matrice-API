const { SVD } = require('svd-js')
const thread = require('../models/thread.model');
const post = require('../models/post.model');
const { primaryTags, getAllKeys } = require("../utils/stat");

module.exports.createThread = async (req, res) => {
    if(req.user){
        if(req.user_token_data){
            if(!req.thread_data){
                if(req.posts_data && (req.posts_data.length >= 5)){
                    try {
                        // Dictionary which contains the repartition of posts depending on the tag
                        var tagsUser = await primaryTags(req.posts_data);
                        // Create thread with the personalized
                        const t = new thread({ name : req.user_token_data.mail , tags : tagsUser ,posts : []});
                        const savedThread = await t.save();
                        res.status(201).json(savedThread);
                    } catch (error) {
                        res.status(500).json({ error: error.message });
                    }
                }
                else { 
                    try {
                        //console.log(req.SVD);
                        // Array containing the users
                        //console.log(req.users_data.length);
                        // Array containing the posts
                        //console.log(req.SVD_posts_users);
                        let users_tags = []
                        // Count tags for each - found online and modified
                        for(let index = 0 ; index < req.SVD_posts_users.length ; index++){
                            var tagCounts = req.SVD_posts_users[index].reduce((acc, document) => {
                                document.tags.forEach((tag) => {
                                    acc[tag] = (acc[tag] || 0) + 1;
                                });
                                return acc;
                              }, {});
                            users_tags.push(tagCounts)
                        }
                        let allKeys = await getAllKeys(users_tags);
                        users_tags.forEach(doc => {
                            // Create keys if doesn't exists
                            allKeys.forEach(key => {
                                if (!(key in doc)) {
                                    doc[key] = 0;
                                }
                            });
                            // Sort the keys of each documents
                            Object.keys(doc).sort().forEach(sortedKey => {
                                let value = doc[sortedKey];
                                delete doc[sortedKey];
                                doc[sortedKey] = value;
                            });
                        });
                        // Constitute the matrix using Object.values
                        let matrix = users_tags.map(doc => Object.values(doc));
                        console.log(matrix);
                        // SVD call
                        const { u, v, q } = SVD(matrix)
                        console.log("Matrice u:");
                        // Total of u values - we are trying to understand which columns have the similarities between the rows
                        let total = Array(u.length).fill(0);
                        for(let index = 0 ; index < u.length ; index++){
                            for(let jndex = 0 ; jndex < u[index].length ; jndex++){
                                total[index] += u[index][jndex];
                            }
                        }
                        // Found online - find 5 strongest values and their index
                        const findIndicesOfLargestValues = (arr, numIndices) =>
                            Array.from(arr.entries()).sort((a, b) => b[1] - a[1]).slice(0, numIndices).map(([index]) => index);
                        const u5_indexs = findIndicesOfLargestValues(total, 5);
                        console.log(total)
                        // 5 more commons tags
                        console.log(u5_indexs);
                        let tags5 = [] 
                        let keys_sorted = Object.keys(users_tags[0]);
                        u5_indexs.forEach((index) => {
                            tags5.push(keys_sorted[index]);
                        })
                        console.log(tags5);
                        // Value in the total of U
                        console.log("Tag : " + tags5[0] + "Index : " + u5_indexs[0] +" Val dans U : " + total[u5_indexs[0]]);
                        console.log("Tag : " + tags5[1] + "Index : " + u5_indexs[1] +" Val dans U : " + total[u5_indexs[1]]);
                        console.log("Tag : " + tags5[2] + "Index : " + u5_indexs[2] +" Val dans U : " + total[u5_indexs[2]]);
                        console.log("Tag : " + tags5[3] + "Index : " + u5_indexs[3] +" Val dans U : " + total[u5_indexs[3]]);
                        console.log("Tag : " + tags5[4] + "Index : " + u5_indexs[4] +" Val dans U : " + total[u5_indexs[4]]);
                        // Create thread with the 5 tags found thanks to the SVD                        
                        const t = new thread({ name : req.user_token_data.mail , tags : tags5 ,posts : []});
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
                                        { $match: { _id: { $nin: req.thread_data.posts }, motherId : null } },
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
                                        { $match: { _id: { $nin: req.thread_data.posts }, motherId : null, tags : { $in : tagsUser}}},
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