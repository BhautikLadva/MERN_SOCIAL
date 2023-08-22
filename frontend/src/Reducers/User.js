import { createReducer } from "@reduxjs/toolkit";
const initialState = {
    isAuthenticated: false,
};

export const userReducer = createReducer(initialState,{
    //case for login
    LoginRequest: ( state) => {
        state.loading = true;
    },
    LoginSuccess: ( state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
    },
    LoginFailure: ( state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
    },

    //cases for register
    RegisterRequest: ( state) => {
        state.loading = true;
    },
    RegisterSuccess: ( state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
    },
    RegisterFailure: ( state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
    },

    //cases for load user
    LoadUserRequest: ( state) => {
        state.loading = true;
    },
    LoadUserSuccess: ( state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
    },
    LoadUserFailure: ( state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
    },

    //cases for logout user
    LogoutUserRequest: ( state) => {
        state.loading = true;
    },
    LogoutUserSuccess: ( state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
    },
    LogoutUserFailure: ( state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = true;
    },

    clearErrors : (state) => {
        state.error = null;
    },

}); 


//getting the post of the followings
export const postOfFollowingReducer = createReducer(initialState,{
    postOfFollowingRequest : (state) =>{
        state.loading = true;

    },
    postOfFollowingSuccess : (state, action) =>{
        state.loading = false;
        state.posts = action.payload;
    },
    postOfFollowingFailure : (state, action) =>{
        state.loading = false;
        state.error = action.payload;
    },
    clearErrors : (state) => {
        state.error = null;
    },

});


export const allUsersReducer = createReducer(initialState,{
    allUsersRequest : (state) =>{
        state.loading = true;

    },
    allUsersSuccess : (state, action) =>{
        state.loading = false;
        state.users = action.payload;
    },
    allUsersFailure : (state, action) =>{
        state.loading = false;
        state.error = action.payload;
    },
    clearErrors : (state) => {
        state.error = null;
    },

})


export const userProfileReducer = createReducer(initialState,{
    userProfileRequest : (state) =>{
        state.loading = true;

    },
    userProfileSuccess : (state, action) =>{
        state.loading = false;
        state.user = action.payload;
    },
    userProfileFailure : (state, action) =>{
        state.loading = false;
        state.error = action.payload;
    },
    clearErrors : (state) => {
        state.error = null;
    },

})