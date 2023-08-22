const Post = require("../models/Post");
const User = require("../models/User");
const cloudinary = require("cloudinary")

exports.createPost = async (req, res)=> {

    try{

        const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
            folder: "posts",
        });

        const newPostData = {
            caption:req.body.caption,
            image:{
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            },
            owner:req.user._id,
        };

        const post = await Post.create(newPostData);

        const user = await User.findById(req.user._id);

        user.posts.unshift(post._id);

        await user.save();
       
        res.status(201).json({
            success:true,
            message: "Post Created",
        });

    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


//To delete post
exports.deletePost = async (req, res) =>  {

    try {

        const post = await Post.findById(req.params.id);       //finding a post

        if(!post){                                             // post not found
            return res.status(404).json({
                success:false,
                message: "Post not found",
            })
        }

        if(post.owner.toString() !== req.user._id.toString()){     //checkes the post deleting users that he is the owner of post then only he can delete
            return res.status(401).json({
                success:false,
                message:"Unauthorised",
            });
        }

        await cloudinary.v2.uploader.destroy(post.image.public_id);

        // await post.remove();
        await post.deleteOne();

        //after removing post , array of that users post should remove that post
        const user = await User.findById(req.user._id);
        
        const index = user.posts.indexOf(req.params.id);
        user.posts.splice(index, 1);
        await user.save();

        res.status(200).json({
            success:true,
            message:"Post Deleted",
        });

        
    } catch (error) {
        
        res.status(500).json({
            success:false,
            message: error.message,
        });
    }
}




//for likeing a post and dislike if there is already liked

exports.likeAndUnlikePost = async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);     //finding a post

        if(!post){                                           //if post not found
            return res.status(404).json({
                success:false,
                message: "Post not found",
            });
        }

        if(post.likes.includes(req.user._id)){               // dislike a post

            const index = post.likes.indexOf(req.user._id);

            post.likes.splice(index, 1);

            await post.save();

            return res.status(200).json({
                success:true,
                message: "Post Unliked",
            });
        }

        else{                                                 //like a post

            post.likes.push(req.user._id);

            await post.save();

            return res.status(200).json({
                success:true,
                message: "Post liked",
            });
        }

        
        
    } catch (error) {
       
        res.status(500).json({
            success:false,
            message: error.message,
        });
    }
}


//getting the post of the user that following
exports.getPostOfFollowing = async (req, res) =>{

    try {
        
        const user = await User.findById(req.user._id);

        const posts = await Post.find({
            owner: {
                $in : user.following,                         //mongo ("in") method
            },
        }).populate("owner likes comments.user");

        res.status(200).json({
            success:true,
            posts: posts.reverse(),
        });

    } catch (error) {
        
        res.status(500).json({
            success:false,
            message: error.message,
        });
    }
}


//Update caption of post
exports.upadteCaption = async (req, res) =>{

    try {

        const post = await Post.findById(req.params.id);                //finding post by id

        if(!post){
            return res.status(400).json({
                success:false,
                message:"Post not found",
            });
        }

        if(post.owner.toString() !== req.user._id.toString()){           //check kare che k login karelo user j post update kare che ne te

            return res.status(401).json({
                success:false,
                message:"Unathorised",
            });
        }

        post.caption = req.body.caption;
        await post.save();
        res.status(200).json({
            success:true,
            message:"Post Updated",
        });
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message,
        });
    }
}



//Adding comments to a post
exports.commentOnPost = async (req, res)=>{

    try {

        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                success:false,
                message:"Post not found",
            }); 
        }

        let commentIndex = -1;


        //checking if comment already exists
        post.comments.forEach((item, index) => {
            
            if(item.user.toString() === req.user._id.toString()){
                commentIndex=index;
            }
        });

        if(commentIndex !== -1){
            post.comments[commentIndex].comment = req.body.comment;

            await post.save();

            return res.status(200).json({
                success:true,
                message:"Comment Updated",
            });
        }
        else{
            post.comments.push({                               //adding comment
                user: req.user._id,
                comment: req.body.comment,
            });

            await post.save();
            return res.status(200).json({
                success:true,
                message:"Comment added",
            });
        }
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message,
        });
    }
}


//Delete comment
exports.deleteComment = async (req, res) =>{

    try {

        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                success:false,
                message:"Post not found",
            }); 
        }


        //Checking if owner wants to delete
        if (post.owner.toString()===req.user._id.toString()) {         //user teni post ni koi pan comment delete kari sake e mate

            if(req.body.commentId==undefined){
                return res.status(400).json({
                    success:false,
                    message:"Comment Id is required",
                });
            }

            post.comments.forEach((item, index) => {
            
                if(item._id.toString() === req.body.commentId.toString()){
                    return post.comments.splice(index, 1);
                }
            });

            await post.save();

            return res.status(200).json({
                success:true,
                message:"Selected Comment has Deleted"
            })
            
        } else {                                           //agar koi bi post par tame comment karo to te delete karva
            
            post.comments.forEach((item, index) => {
            
                if(item.user.toString() === req.user._id.toString()){
                    return post.comments.splice(index, 1);
                }
            });

            await post.save();

            return res.status(200).json({
                success:true,
                message:"Your Comment Has Deleted",
            });
        }
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message,
        });
    }
}
