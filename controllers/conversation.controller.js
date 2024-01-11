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
    if(req.user && req.user_token_data){
        if(req.conv_data){
            let { message, picture } = req.body;
            if(!picture || picture.length < 1){
                picture = "";
            }
            let m = {
                userId : req.user_token_data._id,
                message : message,
                picture : picture
            };
            await conversation.updateOne(
                { _id: req.conv_data._id },
                { $push: { messages: m }, $set: { views : [] } }
            );
            res.status(200).json(m);
        }
        else {
            res.status(400).send("Wrong _id : conv_id");
        }
    }
}

module.exports.getConvs = async(req, res) => {
    if(req.user){
        if(req.convs_data && req.convs_data.length > 0){
            res.status(200).json(req.convs_data);
        }
        else{
            res.status(400).send("No convs");
        }
    }
}

module.exports.getMessages = async(req, res) => {
    if(req.user){
        if(req.conv_data){
            let { message_date } = req.body; 
            if(!message_date){
                message_date = new Date();
            }
            let messages = await conversation.aggregate([
                { $match: { _id: req.conv_data._id } },
                { $unwind: "$messages" },
                { $sort: { "messages.creation": 1 } },
                { $limit: 10 },
                { $match: { "messages.creation": { $lt : new Date(message_date) } } },
                { $project: {
                    _id: 0,
                    messageId: "$messages._id",
                    userId: "$messages.userId",
                    message: "$messages.message",
                    picture: "$messages.picture",
                    creation: "$messages.creation"
                }}
            ]);
            await conversation.findOneAndUpdate( { _id : req.conv_data._id},  { $push: { views : req.user._id} });
            res.status(200).json(messages);
        }
        else {
            res.status(400).send("Wrong _id : conv_id");
        }
    }
}


module.exports.exists = async(req, res) => {
    if(req.user){
        if(req.user_data){  
            let conv_users = [req.user_data._id, req.user._id];
            let conv = await conversation.find( { users : { $in: conv_users }} );
            if(conv && conv.length > 0 ){
                res.status(200).json(conv);
            }
            else{
                res.status(400).send("Don't exists : conv");
            }
        }
        else{
            res.status(500).send("Wrong _id : user_id");
        }
    }
}

//                              //
//-------- MiddleWares----------//
//                              //

module.exports.verifyExists = async (req, res, next) => {
    const { conv_id } = req.body;
    if(conv_id && mongoose.Types.ObjectId.isValid(conv_id)){
        req.conv_data = await conversation.findOne( { _id : conv_id } ).select("-messages") ;
    }
    next();
}

module.exports.MiddleGetConvs = async (req, res, next) => {
    if(req.user && req.user_token_data){
        const { convs_id } = req.body;
        let convs_verify_id = [];
        if( convs_id && convs_id.length > 0 ){
            let convs_verify_id = convs_id.filter((id) => mongoose.Types.ObjectId.isValid(id));
        }
        // Toutes les convs avec de nouveaux messages
        let convs_new = await conversation.find({ 
            users : { $in : [req.user_token_data._id] },
            _id : { $nin : convs_verify_id },
            views : { $nin : [req.user_token_data._id]}
        })
        .select("-messages");
        if(convs_new.length > 10){
            req.convs_data = convs_new;
        }
        else{
            let convs_seen = await conversation.find({ 
                users : { $in : [req.user_token_data._id] },
                _id : { $nin : convs_verify_id }
            })
            .select("-messages")
            .limit(10);
            req.convs_data = convs_new.concat(convs_seen);
        }
        next();
    }
}