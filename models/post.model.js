const mongoose = require('mongoose');

const PostSchema = mongoose.Schema(
    {
        motherId : {
            type : String,
            default : null
        },
        creatorId : {   
            type : String,
            required : true
        },
        ownerId : {
            type : String,
            required : true
        },
        picture : {
            type : String,
            default : null,
            required : false
        },
        description :  {
            type : String,
            default : null,
            required : false
        },
        tags : {
            type : [String],
            required : false
        },
        likes : {
            type : Number,
            default : 0
        },
        comments : {
            type : Number,
            default : 0
        },
        buy : {
            type : Boolean,
            default : 0
        },
        price : {
            type : Boolean,
            default : 10
        },
        creation : {
            type : Date,
            default : new Date()
        }
    }
);

module.exports = mongoose.model("post", PostSchema)