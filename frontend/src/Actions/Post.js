import axios from "axios";

function getCookie(name) {                                        //global function for token
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.indexOf(name + "=") === 0) {
        return cookie.substring(name.length + 1, cookie.length);
      }
    }
    return null;
  };

export const likePost = (id) => async (dispatch) => {

    const token = getCookie("token");

    try {
        dispatch({
            type: "likeRequest",                              //requesting
        });

        const {data} = await axios.get(`https://matic-swap.onrender.com/api/v1/post/${id}`,{
            headers: {
              token
            },
          });                 //fatching data from api

        dispatch({
            type: "likeSuccess",                               
            payload: data.message,
        });
        
    } catch (error) {
        dispatch({
            type: "likeFailure",
            payload: error.response.data.message,
        });
    }
}

//for adding comment
export const addCommentOnPost = (id, comment) => async (dispatch) => {

    const token = getCookie("token");

    try {
        dispatch({
            type: "addCommentRequest",                              //requesting
        });

        const {data} = await axios.put(`https://matic-swap.onrender.com/api/v1/post/comment/${id}`,{                 //fatching data from api
            comment
        },{
            headers:{
                "Content-Type":"application/json",
                token,
            }
        });                 

        dispatch({
            type: "addCommentSuccess",                               
            payload: data.message,
        });
        
    } catch (error) {
        dispatch({
            type: "addCommentFailure",
            payload: error.response.data.message,
        });
    }
}


//for deleting comment on post
export const deleteCommentOnPost = (id, commentId) => async (dispatch) => {

    const token = getCookie("token");

    try {
        dispatch({
            type: "deleteCommentRequest",                              //requesting
        });

        const {data} = await axios.delete(`https://matic-swap.onrender.com/api/v1/post/comment/${id}`,                 //fatching data from api
         {
            data: {commentId},
         },{
            headers: {
              token
            },
          });                 

        dispatch({
            type: "deleteCommentSuccess",                               
            payload: data.message,
        });
        
    } catch (error) {
        dispatch({
            type: "deleteCommentFailure",
            payload: error.response.data.message,
        });
    }
}


//for creating new post
export const createNewPost = (caption, image) => async (dispatch) => {

    const token = getCookie("token");

    try {
        dispatch({
            type: "newPostRequest",                              //requesting
        });

        const {data} = await axios.post(`https://matic-swap.onrender.com/api/v1/post/upload`,                 //fatching data from api
         {
            caption,
            image,
         },{
            headers: {
                "Content-Type": "application/json",
                token,
            },
         });                 

        dispatch({
            type: "newPostSuccess",                               
            payload: data.message,
        });
        
    } catch (error) {
        dispatch({
            type: "newPostFailure",
            payload: error.response.data.message,
        });
    }
}

//updating caption on post
export const updatePost = (caption, id) => async (dispatch) => {

    const token = getCookie("token");

    try {
        dispatch({
            type: "updateCaptionRequest",                              //requesting
        });

        const {data} = await axios.put(`https://matic-swap.onrender.com/api/v1/post/${id}`,                 //fatching data from api
         {
            caption,
         },{
            headers: {
                "Content-Type": "application/json",
                token,
            },
         });                 

        dispatch({
            type: "updateCaptionSuccess",                               
            payload: data.message,
        });
        
    } catch (error) {
        dispatch({
            type: "updateCaptionFailure",
            payload: error.response.data.message,
        });
    }
}


//deleting post
export const deletePost = ( id) => async (dispatch) => {

    const token = getCookie("token");

    try {
        dispatch({
            type: "deletePostRequest",                              //requesting
        });

        const {data} = await axios.delete(`https://matic-swap.onrender.com/api/v1/post/${id}`,{
            headers: {
              token
            },
          });                 //fatching data from api             

        dispatch({
            type: "deletePostSuccess",                               
            payload: data.message,
        });
        
    } catch (error) {
        dispatch({
            type: "deletePostFailure",
            payload: error.response.data.message,
        });
    }
}