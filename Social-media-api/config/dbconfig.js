const mongoose = require("mongoose")
const dotenv = require('dotenv')
dotenv.config()
const connectdb = async() => {
    try{
       const db = await mongoose.connect(process.env.MONGOURI)
        console.log("Database connected successfully", db.connection.host)
    }catch (err){
        console.log(err)
    }
}

module.exports = connectdb