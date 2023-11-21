const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema(
    {
        userId : {
            type : mongoose.SchemaTypes.ObjectId,
            required : true
        },
        message : {
            type : String,
            required : true
        },
        picture : {
            type : String,
            required : false
        },
        sent : {
            type : Date,
            default : new Date()
        },
        seen : {
            type : Boolean,
            default : false
        }
    }
);

// In this object the user A follow the user B
const ConversationSchema = mongoose.Schema(
    {
        users : {
            type : [mongoose.SchemaTypes.ObjectId],
            required : true
        },
        messages : {
            type : [MessageSchema],
            required : true
        }
    }
);

module.exports = mongoose.model("conversation", ConversationSchema)