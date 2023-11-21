const mongoose = require('mongoose');

const TagSchema = mongoose.Schema(
    {
        name : {
            type : String,
            required : true,
            maxlenght : 10,
            unique : true 
        },
        quantity : {
            type : Number,
            default : 0
        }
    }
);

module.exports = mongoose.model("tag", TagSchema)