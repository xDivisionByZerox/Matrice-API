const conversation = require('../models/conversation.model');
const message = require('../models/message.schema');
const mongoose = require('mongoose');

module.exports.create = async(req, res) => {
    if(req.user){
        if(req.users_data && req.users_data.length > 1){
            let { name } = req.body;
            if(!name){
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
    if(req.user && req.user_token_data){
        const { conv_id } = req.body;
        if( conv_id && mongoose.Types.ObjectId.isValid(conv_id)){
            try{
                let conv = await conversation.findOne({ _id : conv_id});
                if(conv){
                    if(conv.admins.indexOf(req.user_token_data._id) != -1){
                        await conversation.deleteOne({ _id : conv_id });
                        res.status(200).send("Deletion success");
                    }
                    else{
                        res.status(400).send("Not conv admin");
                    }
                }
                else{
                    res.status(400).send("Conv don't exists");
                }
            }
            catch(err){
                res.status(500).send('Internal Server Error');
            }
        }
        else{
            res.status(400).send("Invalid id : conv_id");
        }
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