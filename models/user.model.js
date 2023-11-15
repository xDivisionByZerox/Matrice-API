const mongoose = require('mongoose');
const {isEmail} = require('validator');

const UserSchema = mongoose.Schema(
    {
        pseudo : {
            type : String,
            required : true,
            unique : true,
            maxlenght : 20
        },
        mail : {
            type : String,
            required : [true, "Please enter a email"],
            unique : true,
            lowercase : true,
            maxlenght : 50,
            validate : [isEmail, "Please enter a correct email"]
        },
        password : {
            type : String,
            required : true,
            unique : false,
            maxlenght : 255
        },
        lastname : {
            type : String,
            required : true,
            unique : false,
            maxlenght : 20
        },
        firstname : {
            type : String,
            required : true,
            unique : false,
            maxlenght : 20
        },
        picture : {
            type : String,
            required : false,
            unique : false,
            maxlenght : 20
        },
        bio : {
            type : String,
            required : false,
            unique : false,
            maxlenght : 255
        },
        birthday : {
            type : Date,
            required : true,
            unique : true
        },
        rank : {
            type : String,
            required : false,
            unique : false
        },
        subscribes : {
            type : Number,
            default : 0
        },
        subscribed : {
            type : Number,
            default : 0
        },
        coins : {
            type : Number,
            default : 0,
            min : 0
        },
        posts  : {
            type : Number,
            default : 0
        },
        creation : {
            type : Date,
            default : new Date()
        }
    }
);

// Fire function after doc saved in base
UserSchema.post('save', function(doc, next  ) {
    console.log("Post saved : post");
    next();
});

UserSchema.pre('save', function(next  ) {
    console.log("Post saved : pre", this);
    next();
});

module.exports = mongoose.model("user", UserSchema)