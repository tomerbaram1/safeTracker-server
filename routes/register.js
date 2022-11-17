const bcrypt = require('bcrypt')
const Joi = require('joi')
const express = require('express')
const { User, genAuthToken } = require('../models/user')
const router = express.Router()

// Get all Method
router.get("/",async(req,res)=>{
	const users = await User.find({})
	return res.send(users)
})


// Post Method
router.post('/',async (req,res) => {
console.log('sign up progress started');
// validate data
const schema =Joi.object({
    email: Joi.string().min(3).max(200).required().email(),
    fullName: Joi.string().min(3).max(30).required(),
    phoneNumber: Joi.string().min(7).max(12).required(),
    password: Joi.string().min(8).max(200).required()
})
console.log('validation progress started');

// checked if user already exists
const { error } = schema.validate(req.body);
if ( error ) return res.status(400).send(error.details[0].message);
const userExists  = await User.findOne({ email: req.body.email});
console.log("req.body",req.body);
console.log("user exists",userExists);
if (userExists) return res.status(400).send("User already exists");
// create a document
let user = new User({
    email: req.body.email,
    fullName: req.body.fullName,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
    children: req.body.children,
    connectionTokens: req.body.connectionTokens,
    BaseLocation: req.body.BaseLocation
});
console.log("new user created",user);
// hash password(so no one could access the info)
const salt = await bcrypt.genSalt(10)
user.password = await bcrypt.hash(user.password, salt)

if (user) {
    res.status(201).json({
      _id: user.id,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      children: req.body.children,
    connectionTokens: req.body.connectionTokens,
    BaseLocation: req.body.BaseLocation,
      token: genAuthToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
  user = await user.save()
  console.log("user created");
})



// Delete One Method
router.delete("/:id",async(req,res) =>{
    await User.findByIdAndRemove({ _id: req.params.id })
    return res.send('user deleted')
   })

module.exports = router;
