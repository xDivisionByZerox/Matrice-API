const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema(
    {
        userId : {
            type : mongoose.SchemaTypes.ObjectId,
            required : true
        },
        message : {
            type : String,
            required : false
        },
        picture : {
            type : String,
            required : false
        },
        creation : {
            type : Date,
            default : new Date()
        },
        creation : {
            type : Date,
            default : new Date()
        } 
    }
);

module.exports = MessageSchema; 