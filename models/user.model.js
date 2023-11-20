const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require("bcrypt")

const UserSchema = mongoose.Schema(
    {
        nickname : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
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
            maxlenght : 255
        },
        lastname : {
            type : String,
            required : true,
            lowercase : true,
            maxlenght : 20
        },
        firstname : {
            type : String,
            required : true,
            lowercase : true,
            maxlenght : 20
        },
        picture : {
            type : String,
            required : false,
            maxlenght : 20,
            default : null
        },
        bio : {
            type : String,
            required : false,
            maxlenght : 255,
            default : null
        },
        birthday : {
            type : Date,
            required : true
        },
        rank : {
            type : String,
            default : "beginner"
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

// Fire function after doc saved in base.
UserSchema.post('save', function(doc, next  ) {
    next();
});

UserSchema.pre('save', function(next) {
    // Encrypt the password before writing it in database
    bcrypt
    .hash(this.password, Number(process.env.salt_round))
    .then(hash => {
        this.password = hash;
        this.birthday = Date(this.birthday)
        next();
    })
    .catch(err => console.error(err.message))
});

module.exports = mongoose.model("user", UserSchema)