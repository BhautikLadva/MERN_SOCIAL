const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const cors = require('cors');
app.use(cors());


if(process.env.NODE_ENV !== "production"){
    require("dotenv").config({ path:".env"})
}


//Using Middlewares
app.use(express.json({ limit : "500mb" }));
app.use(express.urlencoded({ limit : "500mb", extended:true }));
app.use(cookieParser());

//Importing routes
const post = require("./routes/post");
const user = require("./routes/user");



//Using routes
app.use("/api/v1", post);
app.use("/api/v1", user);

module.exports=app;
