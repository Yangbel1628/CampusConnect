require("dotenv").config();

const express = require('express');
const connectDB = require("./config/db")
const app = express();

//connect database
connectDB();

//middleware
app.use(express.json()); // parse json bpdy

//test route
app.get('/', (req,res) => {
    res.send('api is working');
});

//start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server is running at port ${port}`);
});