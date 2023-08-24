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

//accesing api request to postman for login api
//sending login data to api
export const loginUser = (email, password)=> async (dispatch) =>{

    try {

        dispatch({                                         //firstly loginrequest will be dispatched
            type:"LoginRequest"
        });
        
        const { data } = await axios.post(                   //if login success then 
            "https://matic-swap.onrender.com/api/v1/login",                               //backend route path for login
            { email, password },
            {
              headers:{
                "Content-Type":"application/json",
              },
            }
        );
        console.log(data);
        const token = data.token;
        function setCookie(name, value, days) {
            const expiration = new Date();
            expiration.setTime(expiration.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = "expires=" + expiration.toUTCString();
            document.cookie = name + "=" + value + ";" + expires + ";path=/";
          }
        setCookie("token", token, 7);
        dispatch({                                          //Loginsuccess
            type:"LoginSuccess",
            payload: data.user,
        });
    } catch (error) {
        dispatch({
            type: "LoginFailure",
            payload: error.response.data.message,
        });
    }
};


export const loadUser = ()=> async (dispatch) =>{

    const token = getCookie("token");

    try {

        dispatch({                                         
            type:"LoadUserRequest"
        });
        
        const { data } = await axios.get("https://matic-swap.onrender.com/api/v1/me",{
            headers: {
              token
            },
          });

        dispatch({                                          
            type:"LoadUserSuccess",
            payload: data.user,
        });
    } catch (error) {
        dispatch({
            type: "LoadUserFailure",
            payload: error.response.data.message,
        });
    }
};


export const getFollowingPosts = () => async (dispatch) => {
    const token = getCookie("token");

    try {
        dispatch({
            type: "postOfFollowingRequest",                              //requesting
        });

        const {data} = await axios.get("https://matic-swap.onrender.com/api/v1/posts",{
            headers: {
              token
            },
          });                 //fatching data from api

        dispatch({
            type: "postOfFollowingSuccess",                               
            payload: data.posts,
        });
        
    } catch (error) {
        dispatch({
            type: "postOfFollowingFailure",
            payload: error.response.data.message,
        });
    }
}


export const getMyPosts = () => async (dispatch) => {

    
      const token = getCookie("token");

    try {
        dispatch({
            type: "myPostsRequest",                              //requesting
        });

        const {data} = await axios.get("https://matic-swap.onrender.com/api/v1/my/posts",{
            headers: {
              token
            },
          });                 //fatching data from api

        dispatch({
            type: "myPostsSuccess",                               
            payload: data.posts,
        });
        
    } catch (error) {
        dispatch({
            type: "myPostsFailure",
            payload: error.response.data.message,
        });
    }
}




export const getAllUsers = 
    () =>                            //name = ""
    async (dispatch) => {
        const token = getCookie("token");

    try {
        dispatch({
            type: "allUsersRequest",                              //requesting
        });

        const {data} = await axios.get(`https://matic-swap.onrender.com/api/v1/users`,{
            headers: {
              token
            },
          });                 //fatching data from api ?name=${name}

        dispatch({
            type: "allUsersSuccess",                               
            payload: data.users,
        });
        
    } catch (error) {
        dispatch({
            type: "allUsersFailure",
            payload: error.response.data.message,
        });
    }
}


export const logoutUser = ()=> async (dispatch) =>{

    try {

        dispatch({                                         //firstly logoutrequest will be dispatched
            type:"LogoutUserRequest"
        });
        
        await axios.get("https://matic-swap.onrender.com/api/v1/logout");

        dispatch({                                          //Logoutsuccess
            type:"LogoutUserSuccess",
        });
    } catch (error) {
        dispatch({
            type: "LogoutUserFailure",
            payload: error.response.data.message,
        });
    }
};


export const registerUser = (name,email, password, avatar)=> async (dispatch) =>{

    try {

        dispatch({                                         
            type:"RegisterRequest"
        });
        
        const { data } = await axios.post(                    
            "https://matic-swap.onrender.com/api/v1/register",                               
            { name,email, password, avatar},
            {
              headers:{
                "Content-Type":"application/json",
              },
            }
        );

        dispatch({                                          
            type:"RegisterSuccess",
            payload: data.user,
        });
    } catch (error) {
        dispatch({
            type: "RegisterFailure",
            payload: error.response.data.message,
        });
    }
};


export const updateProfile = (name,email, avatar)=> async (dispatch) =>{

    const token = getCookie("token");

    try {

        dispatch({                                         
            type:"updateProfileRequest"
        });
        
        const { data } = await axios.put(                    
            "https://matic-swap.onrender.com/api/v1/update/profile",                               
            { name,email, avatar},
            {
              headers:{
                "Content-Type":"application/json",
                token,
              },
            }
        );

        dispatch({                                          
            type:"updateProfileSuccess",
            payload: data.message,
        });
    } catch (error) {
        dispatch({
            type: "updateProfileFailure",
            payload: error.response.data.message,
        });
    }
};



export const updatePassword = (oldPassword, newPassword)=> async (dispatch) =>{

    const token = getCookie("token");

    try {

        dispatch({                                         
            type:"updatePasswordRequest"
        });
        
        const { data } = await axios.put(                    
            "https://matic-swap.onrender.com/api/v1/update/password",                               
            { oldPassword, newPassword},
            {
              headers:{
                "Content-Type":"application/json",
                token,
              },
            }
        );

        dispatch({                                          
            type:"updatePasswordSuccess",
            payload: data.message,
        });
    } catch (error) {
        dispatch({
            type: "updatePasswordFailure",
            payload: error.response.data.message,
        });
    }
};


//for delete profile
export const deleteMyProfile = ()=> async (dispatch) =>{

    const token = getCookie("token");

    try {

        dispatch({                                         
            type:"deleteProfileRequest"
        });
        
        const { data } = await axios.delete("https://matic-swap.onrender.com/api/v1/delete/me",{
            headers: {
              token
            },
          });

        dispatch({                                          
            type:"deleteProfileSuccess",
            payload: data.message,
        });
    } catch (error) {
        dispatch({
            type: "deleteProfileFailure",
            payload: error.response.data.message,
        });
    }
};



//for forgot password
export const forgotPassword = (email)=> async (dispatch) =>{

    try {

        dispatch({                                         
            type:"forgotPasswordRequest"
        });
        
        const { data } = await axios.post(
        "https://matic-swap.onrender.com/api/v1/forgot/password", 
        {
            email,
        },
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
        );

        dispatch({                                          
            type:"forgotPasswordSuccess",
            payload: data.message,
        });
    } catch (error) {
        dispatch({
            type: "forgotPasswordFailure",
            payload: error.response.data.message,
        });
    }
};


//for reset password
export const resetPassword = (token, password)=> async (dispatch) =>{

    try {

        dispatch({                                         
            type:"resetPasswordRequest"
        });
        
        const { data } = await axios.put(
        `https://matic-swap.onrender.com/api/v1/password/reset/${token}`, 
        {
            password,
        },
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
        );

        dispatch({                                          
            type:"resetPasswordSuccess",
            payload: data.message,
        });
    } catch (error) {
        dispatch({
            type: "resetPasswordFailure",
            payload: error.response.data.message,
        });
    }
};



export const getUserPosts = (id) => async (dispatch) => {

    const token = getCookie("token");

    try {
        dispatch({
            type: "userPostsRequest",                              //requesting
        });

        const {data} = await axios.get(`https://matic-swap.onrender.com/api/v1/userposts/${id}`,{
            headers: {
              token
            },
          });                 //fatching data from api

        dispatch({
            type: "userPostsSuccess",                               
            payload: data.posts,
        });
        
    } catch (error) {
        dispatch({
            type: "userPostsFailure",
            payload: error.response.data.message,
        });
    }
}


export const getUserProfile = (id) => async (dispatch) => {

    const token = getCookie("token");

    try {
        dispatch({
            type: "userProfileRequest",                              //requesting
        });

        const {data} = await axios.get(`https://matic-swap.onrender.com/api/v1/user/${id}`,{
            headers: {
              token
            },
          });                 //fatching data from api

        dispatch({
            type: "userProfileSuccess",                               
            payload: data.user,
        });
        
    } catch (error) {
        dispatch({
            type: "userProfileFailure",
            payload: error.response.data.message,
        });
    }
}



export const followAndUnfollowUser = (id) => async (dispatch) => {

    const token = getCookie("token");

    try {
        dispatch({
            type: "followUserRequest",                              //requesting
        });

        const {data} = await axios.get(`https://matic-swap.onrender.com/api/v1/follow/${id}`,{
            headers: {
              token
            },
          });                 //fatching data from api

        dispatch({
            type: "followUserSuccess",                               
            payload: data.message,
        });
        
    } catch (error) {
        dispatch({
            type: "followUserFailure",
            payload: error.response.data.message,
        });
    }
}
