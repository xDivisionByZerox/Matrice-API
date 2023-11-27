const mongoose = require('mongoose');

const RankSchema = mongoose.Schema(
    {
        name : {
            type : String,
            unique : true,
            required : true
        },
        price : {
            type : Number,
            required : true
        },
        num : {
            type : Number,
            required : true
        }
    }
);

module.exports = mongoose.model("rank", RankSchema)