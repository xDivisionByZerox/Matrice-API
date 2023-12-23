const conversation = require('../models/conversation.model');
const message = require('../models/message.schema');
const mongoose = require('mongoose');

module.exports.create = async(req, res) => {
    if(req.user){
        if(req.users_data && req.users_data.length > 1){
            let { name } = req.body;
            if(!name){
                // map user name into name
                let nicknames = req.users_data.map(document => document.nickname);
                name = nicknames.join("_");
            } 
            try{
                let idArray = req.users_data.map(document => document._id);
                let user_id = new mongoose.mongo.ObjectId(req.user._id);
                idArray.push(user_id);
                let conv = new conversation({
                    name : name,
                    users : idArray,
                    admins : [user_id],
                    messages : [],
                    views : [user_id]
                });
                const c = await conv.save();
                res.status(200).json(c);
            }
            catch(err){
                console.log(err);
                res.status(500).send('Internal Server Error');
            }
        }
        else{
            res.status(400).send("Invalid users : users_id");
        }
    }
}

module.exports.delete = async(req, res) => {
    if(req.user){
    
    }
}

module.exports.send = async(req, res) => {
    if(req.user){
    
    }
}

module.exports.getConvs = async(req, res) => {
    if(req.user){
        
    }
}

module.exports.getMessages = async(req, res) => {
    if(req.user){
        
    }
}