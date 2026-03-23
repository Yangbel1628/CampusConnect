const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: {
        type:string,
        request:true,
        trim:true,
    },

    email: {
        type:string,
        request:true,
        unique:true,
        lowercase:true,
    },

    password: {
        type:string,
        request:true,
    },

    bio: {
        type:string,
        default: "",
    },

    profilePicture: {
        type:string,
        default: "",
    },
},
 { timestamp:true}
);

module.export = mongoose.model("user",userSchema);