const mongoose = require('mongoose');

// In this object the user A follow the user B
const ConversationSchema = mongoose.Schema(
    {
        users : {
            type : [String],
            required : true
        },
        messages : {
            type : [],
            required : true
        }
    }
);

module.exports = mongoose.model("conversation", ConversationSchema)