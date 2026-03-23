const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        await
        mongoose.connect(process.env.MONGO_URL);
        console.log("mongoDB connected");
    } catch (error) {
        console.error("database connection failed", error);
    }
};module.exports = connectDB;