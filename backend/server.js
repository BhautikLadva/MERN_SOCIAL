

const express = require('express');
const { connectDatabase } = require('./config/database');
// const app = express();
require("dotenv").config();

const app = require("./app");

// const allowedOrigins = ['https://maticswap.netlify.app'];

// app.use(cors({
//   origin: function(origin, callback) {
//     if (allowedOrigins.includes(origin) || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   }
// }));

// const port = 4000;
const port = process.env.PORT;


const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// cloudinary.config({
//   cloud_name: CLOUDINARY_NAME,
//   api_key: CLOUDINARY_API_KEY,
//   api_secret: CLOUDINARY_API_SECRET,
// });


connectDatabase();


// app.listen(process.env.PORT,()=>{
//     console.log('Server is running on port ${process.env.PORT}');
// })

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });