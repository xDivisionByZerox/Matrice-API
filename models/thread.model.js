const mongoose = require('mongoose');

const ThreadSchema = mongoose.Schema(
    {
        name : {
            type : String,
            required : true
        },
        tags : {
            type : {},
            required : true
        },
        posts : {
            type : [mongoose.SchemaTypes.ObjectId],
            required : false
        }
    }
);

module.exports = mongoose.model("thread", ThreadSchema)