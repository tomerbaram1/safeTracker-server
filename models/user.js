const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const schema = mongoose.Schema

const UserSchema = new schema({
  email: {
    type: String,
    required: true,
  },

  phoneNumber: {
    type: String,
    required: true,
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
        batteryLevel:Number,
        batteryStatus:String,
        events:[{event:String,time:Number}],
        connectionToken:String,
        location:[{latitude:String,longitude:String,time:Number,locationName:String}]}
    ],

    // [{childname: String, phone: String,batteryLevel:Number,  events:[],connectionToken:String,  location:[]}}]
    connectionTokens:Array,
    BaseLocation:[{latitude:String,longitude:String,name:String}]
}) 


<<<<<<< HEAD
=======
  children:[
    {childname: String,
    phone: String,
    batteryLevel:Number,
    image: String,
    events:[{event:String,time:Number}],
    connectionToken:String,
    location:[{latitude:String,longitude:String,time:Number,locationName:String}] }
],
 //[{childname:'yossi',phone:'12345678',batteryLevel:batteryLevel,events:[],connectionToken:'c8d682c1-cd6b',location:[]}]
  // connectionTokens:Array,
  BaseLocation: [{ latitude: String, longitude: String, name: String }],
});
>>>>>>> f7dfd65 (cloudinary)


const User = mongoose.model('user', UserSchema)

const genAuthToken = (user => {
    const secretKey = process.env.JWT_SECRET;
    const token = jwt.sign(
    {
        _id: user._id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        fullName: user.fullName,
        children: user.children,
        connectionTokens:user.connectionTokens,
        BaseLocation:user.BaseLocation
        
    },

    secretKey
    
    );
    return token
})


module.exports = {User,genAuthToken};