const mongoose = require('mongoose');

// The userId like this post
const LikeSchema = mongoose.Schema(
    {
        userId : {
            type : String,
            required : true
        },
        postId : {
            type : String,
            required : true
        }
    }
);

module.exports = mongoose.model("like", LikeSchema)