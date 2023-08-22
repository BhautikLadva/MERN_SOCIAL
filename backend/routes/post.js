const express = require("express");
const { createPost, likeAndUnlikePost, deletePost, getPostOfFollowing, upadteCaption, commentOnPost, deleteComment } = require("../controllers/post");
const {isAuthenticated} = require("../middlewares/auth");

const router = express.Router();

router.route("/post/upload").post(isAuthenticated, createPost);

router
    .route("/post/:id")
    .get(isAuthenticated, likeAndUnlikePost)
    .put(isAuthenticated, upadteCaption)
    .delete(isAuthenticated, deletePost);


router.route("/posts").get(isAuthenticated, getPostOfFollowing);

router.route("/post/comment/:id").put(isAuthenticated, commentOnPost).delete(isAuthenticated, deleteComment);

//localhost:3000/api/v1/post/upload   will be apis link



module.exports = router;