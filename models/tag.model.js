const mongoose = require('mongoose');

const TagSchema = mongoose.Schema(
    {
        name : {
            type : String,
            required : true,
            maxlenght : 20
        }
    }
);

module.exports = mongoose.model("tag", TagSchema)