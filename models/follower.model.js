const mongoose = require('mongoose');

// In this object the user A follow the user B
const FollowerSchema = mongoose.Schema(
    {
        userA : {
            type : mongoose.SchemaTypes.ObjectId,
            require : true
        },
        userB : {
            type : mongoose.SchemaTypes.ObjectId,
            require : true
        },
        creation : {
            type : Date,
            default : new Date()
        }
    }
);

module.exports = mongoose.model("follower", FollowerSchema)