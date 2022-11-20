const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const schema = mongoose.Schema;

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
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  children: [
    {
      childName: String,
      childPhone: String,
      connectionToken: String,
      location: [{ latitude: String, longitude: String, time: Number }],
    },
  ],
  // connectionTokens:Array,
  BaseLocation: [{ latitude: String, longitude: String, name: String }],
});

const User = mongoose.model("user", UserSchema);


    password: {
        type: String,
        required: true
    },
    
    children:[
        {childname: String,
        phone: String,
        batteryLevel:Number,
        events:[{event:String,time:Number}],
        connectionToken:String,
        location:[{latitude:String,longitude:String,time:Number,locationName:String}]}
    ],
    connectionTokens:Array,
    BaseLocation:[{latitude:String,longitude:String,name:String}]
}) 

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
      connectionTokens: user.connectionTokens,
      BaseLocation: user.BaseLocation,
    },

    secretKey
  );
  return token;
};

module.exports = { User, genAuthToken };
