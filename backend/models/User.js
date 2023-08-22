const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema= new mongoose.Schema({

    name:{
        type: String,
        required: [true, "Please enter a name"],
    },

    avatar:{
        public_id: String,
        url: String,
    },
    
    email:{
        type: String,
        required: [true, "Please enter an email"],
        unique: [true,"Email already exists"]
    },

    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [6, "Password must be at least 6 characters"],
        select: false,        //whenever we accesing data it does not incluse pasword to access
    },

    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Post",
        },
    ],

    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
    ],

    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
    ],

    resetPasswordToken: String,

    resetPasswordExpire: Date,
});

//  .pre is a event that runs before saving of data and i will use it to bcrypt the password before sotring in databas so we can get bcrypted password in db
userSchema.pre("save", async function (next){

    if(this.isModified("password")){       //if password reseted by user then only hash it again else previous hashed pass. should be seen in db
        this.password = await bcrypt.hash(this.password, 10);

    }

    next();
});


//matchPassword used in matching the pass in users.js is compared by this function
userSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

//generateToken method
userSchema.methods.generateToken = function(){
    return jwt.sign({_id: this._id}, process.env.JWT_SECRET);     // sign is jwt method to create token
};


//getResetPasswordToken method
userSchema.methods.getResetPasswordToken = function(){

    const resetToken = crypto.randomBytes(20).toString("hex");                //for token

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");           //hashing

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;                   //token valids for 10 minutes

    return resetToken;

}



module.exports = mongoose.model("User", userSchema);