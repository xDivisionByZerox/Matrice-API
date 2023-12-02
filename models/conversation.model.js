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
        },
        views :{
            type : [mongoose.SchemaTypes.ObjectId],
            required : true
        }
    }
);

module.exports = mongoose.model("conversation", ConversationSchema);
module.exports = mongoose.model("message", MessageSchema); 