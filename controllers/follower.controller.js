const follower = require('../models/follower.model');
const user = require('../models/user.model');

module.exports.follow = async (req, res) => {
    link = {
        userA : req.user._id,
        userB : req.body.user_id,
    }
    const existingEntry = await follower.findOne(link);
    if (existingEntry) {
       res.status(400).json("Follow : relationship already exists");
    }
    else{
        const newFollower = new follower(link);
        await newFollower.save();
        res.status(200).json("Follow : relationship created successfully");
    }
};

module.exports.unfollow = async (req, res) => {
    link = {
        userA : req.user._id,
        userB : req.body.user_id,
    }
    const existingEntry = await follower.findOne(link);
    if (!existingEntry) {
       res.status(400).json("UnFollow : relationship don't exists");
    }
    else{
        await follower.deleteMany(link);
        res.status(200).json("Unfollow: relationship deleted successfully");
    }    
};  