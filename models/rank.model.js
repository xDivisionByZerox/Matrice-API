const mongoose = require('mongoose');

const RankSchema = mongoose.Schema(
    {
        name : {
            type : String,
            required : true
        },
        price : {
            type : Number,
            required : true
        }
    }
);

module.exports = mongoose.model("rank", RankSchema)