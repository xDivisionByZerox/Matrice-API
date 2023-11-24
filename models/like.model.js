const mongoose = require('mongoose');

// The userId like this post
const LikeSchema = mongoose.Schema(
    {
        userId : {
            type : mongoose.SchemaTypes.ObjectId,
            required : true
        },
        postId : {
            type : mongoose.SchemaTypes.ObjectId,
            required : true
        },
        creation : {
            type : Date,
            default : new Date()
        }
    }
);

module.exports = mongoose.model("like", LikeSchema);