const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema(
    {
        userId : {
            type : String,
            required : true
        },
        message : {
            type : String,
            required : true
        },
        sent : {
            type : Date,
            default : new Date()
        },
        seen : {
            type : Boolean,
            default : falsex
        }
    }
);

// In this object the user A follow the user B
const ConversationSchema = mongoose.Schema(
    {
        users : {
            type : [String],
            required : true
        },
        messages : {
            type : [MessageSchema],
            required : true
        }
    }
);

module.exports = mongoose.model("conversation", ConversationSchema)