const mongoose = require('mongoose');

const ViewSchema = mongoose.Schema(
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
            default : Date.now
        }
    }
);

module.exports = mongoose.model("view", ViewSchema);