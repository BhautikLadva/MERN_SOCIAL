import{createReducer} from "@reduxjs/toolkit"

const initialState = {}

export const likeReducer = createReducer(initialState,{
    likeRequest: (state) => {
        state.loading=true;
    },
    likeSuccess: (state, action) => {
        state.loading=false;
        state.message = action.payload;
    },
    likeFailure: (state, action) => {
        state.loading=false;
        state.error = action.payload;
    },

    //for comment status
    addCommentRequest: (state) => {
        state.loading=true;
    },
    addCommentSuccess: (state, action) => {
        state.loading=false;
        state.message = action.payload;
    },
    addCommentFailure: (state, action) => {
        state.loading=false;
        state.error = action.payload;
    },

    //for delete comment
    deleteCommentRequest: (state) => {
        state.loading=true;
    },
    deleteCommentSuccess: (state, action) => {
        state.loading=false;
        state.message = action.payload;
    },
    deleteCommentFailure: (state, action) => {
        state.loading=false;
        state.error = action.payload;
    },


    //for new post
    newPostRequest: (state) => {
        state.loading=true;
    },
    newPostSuccess: (state, action) => {
        state.loading=false;
        state.message = action.payload;
    },
    newPostFailure: (state, action) => {
        state.loading=false;
        state.error = action.payload;
    },


    //for updating caption on post
    updateCaptionRequest: (state) => {
        state.loading=true;
    },
    updateCaptionSuccess: (state, action) => {
        state.loading=false;
        state.message = action.payload;
    },
    updateCaptionFailure: (state, action) => {
        state.loading=false;
        state.error = action.payload;
    },


    //for deletepost 
    deletePostRequest: (state) => {
        state.loading=true;
    },
    deletePostSuccess: (state, action) => {
        state.loading=false;
        state.message = action.payload;
    },
    deletePostFailure: (state, action) => {
        state.loading=false;
        state.error = action.payload;
    },


    //for updating profile
    updateProfileRequest: (state) => {
        state.loading=true;
    },
    updateProfileSuccess: (state, action) => {
        state.loading=false;
        state.message = action.payload;
    },
    updateProfileFailure: (state, action) => {
        state.loading=false;
        state.error = action.payload;
    },


    //for updating passowrd
    updatePasswordRequest: (state) => {
        state.loading=true;
    },
    updatePasswordSuccess: (state, action) => {
        state.loading=false;
        state.message = action.payload;
    },
    updatePasswordFailure: (state, action) => {
        state.loading=false;
        state.error = action.payload;
    },


    //delete progile of user
    deleteProfileRequest: (state) => {
        state.loading=true;
    },
    deleteProfileSuccess: (state, action) => {
        state.loading=false;
        state.message = action.payload;
    },
    deleteProfileFailure: (state, action) => {
        state.loading=false;
        state.error = action.payload;
    },


    //for forgot password
    forgotPasswordRequest: (state) => {
        state.loading=true;
    },
    forgotPasswordSuccess: (state, action) => {
        state.loading=false;
        state.message = action.payload;
    },
    forgotPasswordFailure: (state, action) => {
        state.loading=false;
        state.error = action.payload;
    },


    //reset password
    resetPasswordRequest: (state) => {
        state.loading=true;
    },
    resetPasswordSuccess: (state, action) => {
        state.loading=false;
        state.message = action.payload;
    },
    resetPasswordFailure: (state, action) => {
        state.loading=false;
        state.error = action.payload;
    },


    followUserRequest: (state) => {
        state.loading=true;
    },
    followUserSuccess: (state, action) => {
        state.loading=false;
        state.message = action.payload;
    },
    followUserFailure: (state, action) => {
        state.loading=false;
        state.error = action.payload;
    },



    clearErrors: (state) => {
        state.error = null;
    },
    clearMessage: (state) => {
        state.message = null;
    },
});


//reducer for my post
export const myPostsReducer = createReducer(initialState, {
    myPostsRequest: (state) => {
        state.loading=true;
    },
    myPostsSuccess: (state, action) => {
        state.loading=false;
        state.posts= action.payload;
    },
    myPostsFailure: (state, action) => {
        state.loading=false;
        state.error = action.payload;
    },
    clearErrors: (state) => {
        state.error = null;
    },
    
}) ;



export const userPostsReducer = createReducer(initialState, {
    userPostsRequest: (state) => {
        state.loading=true;
    },
    userPostsSuccess: (state, action) => {
        state.loading=false;
        state.posts= action.payload;
    },
    userPostsFailure: (state, action) => {
        state.loading=false;
        state.error = action.payload;
    },
    clearErrors: (state) => {
        state.error = null;
    },
    
}) ;