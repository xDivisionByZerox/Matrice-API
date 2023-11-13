const mongoose = require('mongoose');

const ThreadSchema = mongoose.Schema(
    {
        name : {
            type : String,
            required : true
        },
        tags : {
            type : [String],
            required : true
        },
        posts : {
            type : [String],
            required : true
        }
    }
);

module.exports = mongoose.model("thread", ThreadSchema)