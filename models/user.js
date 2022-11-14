const mongoose = require('mongoose')
const schema = mongoose.Schema

const UserSchema = new schema ({
    email: {
        type: String,
        required: true,
    },

    phoneNumber: {
        type: String,
        required: true
    },

    fullName: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },
    
    children:[
        {childname: String,
        phone: String,
        connectionToken:String,
        location:[{latitude:String,longitude:String}] }
       
    ],
    connectionTokens:Array,
    BaseLocation:[{latitude:String,longitude:String,name:String}]
}) 

const User = mongoose.model('user', UserSchema)
module.exports = User;