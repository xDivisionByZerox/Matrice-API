const mongoose = require('mongoose');
const message = require('./message.schema');

// In this object the user A follow the user B
const ConversationSchema = mongoose.Schema(
    {
        name : {
            type : String,
            required : true
        },
        users : {
            type : [mongoose.SchemaTypes.ObjectId],
            required : true
        },
        admins :{
            type : [mongoose.SchemaTypes.ObjectId],
            required : true
        },
        messages : {
            type : [message],
            required : true
        },
        views :{
            type : [mongoose.SchemaTypes.ObjectId],
            required : true
        }
    }
);

module.exports = mongoose.model("conversation", ConversationSchema);