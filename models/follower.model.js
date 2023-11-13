const mongoose = require('mongoose');

// In this object the user A follow the user B
const FollowerSchema = mongoose.Schema(
    {
        userA : {
            type : String,
            require : true
        },
        userB : {
            type : String,
            require : true
        }
    }
);

module.exports = mongoose.model("follower", FollowerSchema)