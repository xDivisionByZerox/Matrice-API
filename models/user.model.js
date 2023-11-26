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
            type : mongoose.SchemaTypes.ObjectId,
            ref : "rank"
        },
        // Number of followers he have
        subscribes : {
            type : Number,
            default : 0
        },
        // Number of people he follows
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

// Fire function after doc saved in base - coins post can be modified here
UserSchema.post('save', function(doc, next  ) {
    next();
});

// Bcrypt the password
UserSchema.pre('save', function(next) {
    // Encrypt the password before writing it in database
    if(this.password){
        bcrypt
        .hash(this.password, Number(process.env.salt_round))
        .then(hash => {
            this.password = hash;
            this.birthday = Date(this.birthday)
            next();
        })
        .catch(err => console.error(err.message))
    }
});

// Bcrypt the new password
UserSchema.pre('updateOne', function(next) {
    if(this._update.password){
    // Encrypt the password before writing it in database
    bcrypt
    .hash(this._update.password, Number(process.env.salt_round))
    .then(hash => {
        this._update.password = hash;
        next();
    })
    .catch(err => console.error(err.message))
    }
});

module.exports = mongoose.model("user", UserSchema)