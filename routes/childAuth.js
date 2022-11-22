const Joi = require("joi");
const express = require("express");
const { User } = require("../models/user");
const router = express.Router();

router.post("/",async (req,res)=>{
const {connectionToken,id} = req.body
console.log(req.body);
    const schema = Joi.object({
        connectionToken: Joi.string().min(8).max(20).required(),
    });
    //  checked if user already exists
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const user = await User.findOne( { connectionToken } )
    console.log(user);
    // const childIndex = user.children.findIndex((e)=>e.connectionToken==connectionToken)
    console.log(connectionToken, "connectionToken in back");
    console.log(user.fullName, "parents full name in back");
    if (!user) return res.status(400).send("Invalid Connection Token");
    res.json({
        _id:user.id,
        fullName: user.fullName,
        connectionToken: connectionToken,
        // childname:user.children[childIndex].childname
    
    })
})




// router.post("/", async (req, res) => {
//     const { email, password } = req.body;
//     // validate data
//     const schema = Joi.object({
//       email: Joi.string().min(3).max(200).required().email(),
//       password: Joi.string().min(8).max(200).required(),
//     });
//     // checked if user already exists
//     const { error } = schema.validate(req.body);
//     if (error) return res.status(400).send(error.details[0].message);
  
//     const user = await User.findOne({ email });
  
//     if (!user) return res.status(400).send("Invalid email or password");
//     const isValid = await bcrypt.compare(password, user.password);
//     if (!isValid) return res.status(400).send("Invalid email or password");
  
//     res.json({
//       _id: user.id,
//       email: user.email,
//       phoneNumber: user.phoneNumber,
//       fullName: user.fullName,
//       children: req.body.children,
//       connectionTokens: req.body.connectionTokens,
//       BaseLocation: req.body.BaseLocation,
//       token: genAuthToken(user._id),
//     });
//   });

module.exports = router;
