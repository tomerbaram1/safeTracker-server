const express = require('express')
const router = express.Router()
const activatePushNotification= require('../utills/notification')
const { User } = require('../models/user')
const {sosMessage} = require("../utills/sosMessage")

router.patch('/', function(req, res, next) {
    const {id,connectionToken}=req.body;
       console.log("id",id)
    User.findOne({_id:id}).then( async (data) => {
       
        const kidIndex=data.children.findIndex(e=>e.connectionToken==connectionToken)
console.log("22222")
                        await global.io.emit(`${id +"SOS"}`,data.children[kidIndex].childname );
                        // console.log(newMessage.newMessage,"new sos ");
                       await global.io.on('disconnect',()=>{
                           ""})
                     
                    res.json("succsess")

      }).catch(err=>res.json(err))
     
  })



module.exports = router;
