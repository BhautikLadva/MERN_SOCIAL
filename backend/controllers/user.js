const User = require("../models/User");
const Post = require("../models/Post");
const {sendEmail} = require("../middlewares/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary")

exports.register = async (req, res) => {

    try{

        const { name, email, password, avatar } = req.body;

        let user = await User.findOne({email});
        if(user) {
            return res
            .status(400)
            .json({success:false, message: "User already exists"});
        }

        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
        });

        user = await User.create({
            name,
            email,
            password,
            avatar: { public_id: myCloud.public_id, url: myCloud.secure_url},
        });

        const token = await user.generateToken();                     

        const options = {
            expires:new Date(Date.now()+90*24*60*60*1000),
            httpOnly: true,
        };

        res.status(201).cookie("token", token,options)        
        .json({                 
            success:true,
            user,
            token,
        });


    }catch(error){
        res.status(500).json({
            success:false,
            message: error.message,
        });
    }
};



exports.login = async (req, res) => {
    console.log("Request received");

    try{

        const { email , password } = req.body;

        const user = await User.findOne({email}).select("+password").populate("posts followers following");

        if(!user){                                       //if user not registered
            return res.status(400).json({
                success:false,
                message:"User does no exists"
            });
        }

        const isMatch = await user.matchPassword(password);           //matchPassord is method

        if(!isMatch){                                   //incorrect password
            return res.status(400).json({
                success:false,
                message:"Incorrect Password",
            });
        }

        const token = await user.generateToken();                     //generateToken is method
        console.log(token);
        const options = {
            expires:new Date(Date.now()+90*24*60*60*1000),
            httpOnly: true,
        };

        res.status(200).cookie("token", token,options)        //used jwt token generated from above method and setted session expire time 90 days
        .json({
            message: "Login succesful",                 
            success:true,
            user,
            token,
        });
        } catch(error){
            res.status(500).json({
                success:false,
                message: error.message,
            });
       
    }
};

//logout user
exports.logout = async (req, res) =>{

    try {
        
        res
            .status(200)
            .cookie("token", null, {expires : new Date(Date.now()), httpOnly: true})
            .json({
                success:true,
                message: "Logged Out",
            });

    } catch (error) {
        
        res.status(500).json({
            success:false,
            message: error.message,
        });
    }
}


//folllow user
exports.followUser = async (req, res) => {

    try {
        
        const userToFollow = await User.findById(req.params.id);              //passing id
        const loggedInUser = await User.findById(req.user._id);               //finding logged user

        if(!userToFollow){
            return res.status(404).json({
                success:false,
                message: "User not found",
            });
        }

        if(loggedInUser.following.includes(userToFollow._id)){               //if user already following him then as like & dislike we can follow & unfollow

            const indexfollowing = loggedInUser.following.indexOf(userToFollow._id);
            const indexfollwers = userToFollow.followers.indexOf(loggedInUser._id);
            
            loggedInUser.following.splice(indexfollowing, 1);
            userToFollow.followers.splice(indexfollwers, 1);

            await loggedInUser.save();
            await userToFollow.save();

            res.status(200).json({
                success:true,
                message:"User Unfollowed",
            });

        }else{

            loggedInUser.following.push(userToFollow._id);                       //following user and passing id
            userToFollow.followers.push(loggedInUser._id);                       //user na follower ma hu add thai gayo
    
            await loggedInUser.save();
            await userToFollow.save();
    
            res.status(200).json({
                success:true,
                message:"User followed",
            });

        }

    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message,
        });
    }
}


//Update Passwod
exports.updatePassword =  async (req, res) => {

    try {
        
        const user = await User.findById(req.user._id).select("+password");

        const {oldPassword, newPassword } = req.body;

        if(!oldPassword || !newPassword){                         //if user enteres both fields empty
            return res.status(400).json({
                success:false,
                message:"Please provide old and new password",
            });
        }

        const isMatch = await user.matchPassword(oldPassword);

        if(!isMatch){
            return res.status(400).json({
                success:false,
                message: "Incorrect old Password",
            });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success:true,
            message:"Password Updated",
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message,
        });
    }
}



//update profile
exports.updateProfile = async (req, res) =>{

    try {
        
        const user = await User.findById(req.user._id);               //finding user

        const { name, email, avatar } = req.body;

        if(name){
            user.name = name;
        }
        if(email){
            user.email = email;
        }

        if(avatar) {
            await cloudinary.v2.uploader.destroy(user.avatar.public_id);         //deleting previous avatar

            const myCloud = await cloudinary.v2.uploader.upload(avatar, {        //uploading new avatar
                folder:"avatars",
            });
            user.avatar.public_id= myCloud.public_id;
            user.avatar.url = myCloud.secure_url;
        }

        //Avatar TODO

        await user.save();

        res.status(200).json({
            success:true,
            message:"Profile Updated",
        });

    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message,
        });
    }
} 



//Delete user
exports.deleteMyProfile = async (req, res)=>{

    try {

        const user = await User.findById(req.user._id);
        const posts = user.posts;                                  //storing posts of user in posts variable
        const followers = user.followers;
        const following = user.following;
        const userId = user._id;                                   //storing usersid in variable 

        //removing avatar from cloudinary
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);


        await user.deleteOne();

        //Logout user after deleting profile
        res.cookie("token", null,{
            expires: new Date(Date.now()),
            httpOnly: true,
        });

        //Deleting all posts of user
        for(let i=0; i<posts.length; i++){                         //if users deletes his profile then all the posts of him should be removed

            const post = await Post.findById(posts[i]);
            await cloudinary.v2.uploader.destroy(post.image.public_id);        //deleting post from cloudinary
            await post.deleteOne();
        }

        //Removing user from followers following
        for(let i=0; i < followers.length; i++){
            const follower = await User.findById(followers[i]);

            const index = follower.following.indexOf(userId);
            follower.following.splice(index, 1);

            await follower.save();
        }

        //Removing user from followings followers
        for(let i=0; i < following.length; i++){
            const follows = await User.findById(following[i]);

            const index = follows.followers.indexOf(userId);
            follows.followers.splice(index, 1);

            await follows.save();
        }

        //removing all comments of the user from all posts
        const allPosts = await Post.find();

        for(let i=0; i < allPosts.length; i++){
            const post = await Post.findById(allPosts[i]._id);

            for(let j=0; j<post.comments.length; j++){
                if(post.comments[j].user===userId){
                    post.comments.splice(j,1);
                }
            }
            await post.save();
        }

        //removing all likes of the user from all posts

        for(let i=0; i < allPosts.length; i++){
            const post = await Post.findById(allPosts[i]._id);

            for(let j=0; j<post.likes.length; j++){
                if(post.likes[j]===userId){
                    post.likes.splice(j,1);
                }
            }
            await post.save();
        }



        res.status(200).json({
            success:true,
            message:"Profile Delted",
        });
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message,
        });
    }
}


//to see my profile
exports.myProfile = async (req, res)=>{

    try {

        const user = await User.findById(req.user._id).populate("posts followers following");

        res.status(200).json({
            success:true,
            user,
        });
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message,
        });
    }
}



exports.getUserProfile = async (req, res)=>{

    try {

        const user = await User.findById(req.params.id).populate("posts followers following");

        if(!user){

            return res.status(400).json({
                success:false,
                message: "User not Found",
            });
        }

        res.status(200).json({
            success:true,
            user,
        });
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message,
        });
    }
}


//get all the users present in database
exports.getAllUsers = async (req,res)=>{

    try {

        const users = await User.find();

        // { 
        //     name: { $regex: req.query.name, $option: 'i'},                  //for finding users in search tab
        // }

        res.status(200).json({
            success:true,
            users,
        });
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message,
        });
    }
}


//Forgot Password
exports.forgotPassword = async (req, res)=>{

    try {

        const user = await User.findOne({email:req.body.email});                //finding user

        if(!user){

            return res.status(400).json({
                success:false,
                message: "User not Found",
            });
        }

        const resetPasswordToken = user.getResetPasswordToken();              //method done in user model file

        await user.save();

        const resetUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetPasswordToken}`;

        const message = `Reset your Password by clicking on the link below : \n\n ${resetUrl}`;

        try {                                                                 //sending mailfor resetpassword

            await sendEmail({                                                 //imported from senddEmail.js from middleware folder
                email: user.email,
                subject: "Reset Password",
                message,
            });

            res.status(200).json({
                success:true,
                message: `Email sent to ${user.email}`,
            });
            
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();

            res.status(500).json({
                success:false,
                message: error.message,
            });
            
        }

        
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message,
        });
    }
}



//Reset Password
exports.resetPassword = async (req, res) =>{

    try {

        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const user = await User.findOne({                                 //finding a user
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if(!user){
            return res.status(401).json({
                success:false,
                message:"Token is invalid or has expired"
            });
        }

        user.password = req.body.password;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({
            success:true,
            message: "Password Updated",
        });
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message,
        });
    }
}


exports.getMyPosts = async (req,res)=>{

    try {

        const user = await User.findById(req.user._id);               //finding user

        const posts=[];

        for(let i=0; i<user.posts.length; i++){
            const post = await Post.findById(user.posts[i]).populate("likes comments.user owner");
            posts.push(post);
        }

        res.status(200).json({
            success:true,
            posts,
        });
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message,
        });
    }
}


exports.getUserPosts = async (req,res)=>{

    try {

        const user = await User.findById(req.params.id);               //finding user

        const posts=[];

        for(let i=0; i<user.posts.length; i++){
            const post = await Post.findById(user.posts[i]).populate("likes comments.user owner");
            posts.push(post);
        }

        res.status(200).json({
            success:true,
            posts,
        });
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message,
        });
    }
}