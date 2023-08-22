const mongoose = require("mongoose");


exports.connectDatabase = () =>{
    mongoose
        // .connect('mongodb://127.0.0.1:27017/SocialMedia')
        .connect(process.env.MONGO_URI)
        // .then((con)=> console.log('Database Connencted'))     //${con.connection.host}
        .then((con) => console.log(`Database connected ${con.connection.host}`))
        .catch((err)=> console.log(err));
}