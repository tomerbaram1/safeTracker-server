
const express = require('express')
const router = express.Router()
const distance= require('../utills/maps')
const activatePushNotification= require('../utills/notification')
const { User } = require('../models/user')




    // define your router and set it up
    // you can then use io in your routes here
  

/// helpers

function updateKidLocationArray(children,connectionToken,currentLocation)
{
   
    let time=new Date().getTime()
    
    for(let i=0;i<children.length;i++)
    {
        
        if(children[i].connectionToken==connectionToken)
        {
            let obj={latitude:currentLocation.coords.latitude,longitude:currentLocation.coords.longitude,time:time}
          
            children[i].location.length<11?
            children[i].location.push(obj):
            (children[i].location.shift(),children[i].location.push(obj))
        }

    }

return children
}














//testing
router.delete('/delete', function(req, res, next) {
 
 const {id}=req.body;
 User.findOneAndDelete({_id:id}, function (err, docs) {
    if (err){
        console.log(err)
    }
    else{
        console.log("Deleted User : ", docs);
    }

    });

});

let dis;
router.patch('/users/parent/pushNotification', function(req, res, next) {
 
 const {id}=req.body;
 const {token}=req.body;
 const {location}=req.body;
 
 console.log(id+"********************")

 User.findOne({_id:id})
   .then((data) => 
   {
         dis=distance(data.children.location[data.children.location.length-1].latitude,location.coords.latitude,
              data.location[data.children.location.length-1].longitude,location.coords.longitude
                  );
                  
                  activatePushNotification(token,dis)
   
   })
   .catch(next)
});


router.post('/get', function(req, res, next) {
    console.log("S")
    User.find({})
      .then((data) =>res.json(data))
      .catch(next)
  });
//testing

//



///Base locations

router.post('/users/parent/getBaseLocations', function(req, res, next) {
  const {id}=req.body;
  console.log("id")
  User.findOne({_id:id})
    .then((data) =>data?res.json(data.BaseLocation):res.json("user not found"))
    .catch(next)
});

router.patch('/users/parent/addBaseLocations', function(req, res, next) {
 
  const {newLocationsBaseArray,id}=req.body;

console.log("add")

  User.findByIdAndUpdate(id, { $set: {BaseLocation: newLocationsBaseArray} }, { new: false }).then(() => {
    res.send('User updated by id through PATCH');
  }).catch(err=>res.json(err));
});





//childeren location
router.patch('/users/parent/addChildrenLocation', function(req, res, next) {
    const {id,currentLocation,connectionToken,token}=req.body;
    let children;
    console.log("id")
    User.findOne({_id:id})
      .then((data) =>data?
      User.findByIdAndUpdate(id, { $set: {children: updateKidLocationArray(data.children,connectionToken,currentLocation)} },
         { new: false }).then( async (data) => {
            // children=data.children;
            

  
            const kidIndex=data.children.findIndex(e=>e.connectionToken==connectionToken)
            console.log(kidIndex)
            if(distance(data.children[kidIndex].location[data.children[kidIndex].location.length-1].latitude,currentLocation.coords.latitude,
                data.children[kidIndex].location[data.children[kidIndex].location.length-1].longitude,currentLocation.coords.longitude
                 ))
                    //   activatePushNotification(token,"ss")
                      console.log("sssssssssssssssssssssss")
                     
                        await global.io.emit(`${id}`, {children:data.children});
                       await global.io.on('disconnect',()=>{
                           ""
                            })
                     
                   
//
                    res.json("succsess")
                    //
/// pass home name so that it will not fire allways
//
      }).catch(err=>res.json(err))
      
      :res.json("user not found"))
      .catch(next)
     
     
  });
//To do after update we can add socket call to parent clinet and 
//with that we will not need the getChildrenLocation route

  router.post('/users/parent/getChildrenLocation', function(req, res, next) {
    const {id,connectionToken}=req.body;
    User.findOne({_id:id})
      .then((data) =>data? res.json(data.children)  :res.json("user not found"))
      .catch(next)
  });





  module.exports = router;
  
