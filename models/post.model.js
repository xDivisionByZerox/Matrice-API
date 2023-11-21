const mongoose = require('mongoose');

const PostSchema = mongoose.Schema(
    {
        motherId : {
            type : mongoose.SchemaTypes.ObjectId,
            ref : "post",
            default : null
        },
        creatorId : { 
            type : mongoose.SchemaTypes.ObjectId,
            ref : "user"
        },
        ownerId : {
            type : mongoose.SchemaTypes.ObjectId,
            ref : "user"
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
            default : false
        },
        price : {
            type : Number,
            default : 10
        },
        creation : {
            type : Date,
            default : new Date()
        }
    }
);

module.exports = mongoose.model("post", PostSchema);