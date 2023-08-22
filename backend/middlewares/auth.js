const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = async (req, res, next) => {
    console.log("Checking authication");
    try {
        
        // const { token } =req.cookies;
        const token=req.headers['token']



    //if token not found then this and if found then stores hid data by id

    if(!token){
        return res.status(401).json({
            message: "Please login first",
        });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded._id);

    next();

    } catch (error) {
        
        res.status(500).json({
            message: error.message,
        })

    }

};