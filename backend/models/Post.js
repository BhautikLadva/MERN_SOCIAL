const mongoose = require("mongoose");

const postSchema= new mongoose.Schema({

    caption: String,

    image: {
        public_id:String,
        url:String,
    },

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    createdAt:{
        type:Date,
        default: Date.now,
    },

    likes: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "User",    
        },
    ],

    comments:[                                    //comment has 2 object i.e. 1(user) and 2(comment that he has written)
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            comment: {
                type: String,
                required: true,
            },
        },
    ]

});

module.exports = mongoose.model("Post", postSchema);