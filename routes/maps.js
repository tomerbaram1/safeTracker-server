const express = require('express')
const router = express.Router()
const distance= require('../utills/maps')
const activatePushNotification= require('../utills/notification')
const { User } = require('../models/user')




    // define your router and set it up
    // you can then use io in your routes here
  

/// helpers


checkUpdateBatteryStatus(child)
{if(child.batteryLevel>=10&&child.batteryStatus=="under10")
{
  child.batteryStatus="under20"
}




else if(child.batteryLevel>=20&&child.batteryStatus=="under20")
{
  child.batteryStatus="under50"
}


else if(child.batteryLevel<50&&child.batteryStatus=="under50")
{
  child.batteryStatus="normal"
}
return child
}



function   isBatteryNotifications(data,connectionToken,token,batteryLevel)
{

  const kidIndex=data.children.findIndex(e=>e.connectionToken==connectionToken)
  const children=data.children;




  if(children[kidIndex].batteryLevel<=10&&children[kidIndex].batteryStatus=="normal"
  || children[kidIndex].batteryStatus=="under50"|| children[kidIndex].batteryStatus=="under20")
  {activatePushNotification(token,
    data.children[kidIndex].connectionToken
    +" phone has less then - 10%")
    children[kidIndex].batteryStatus="under10"
  }




 else if(children[kidIndex].batteryLevel<=20&&children[kidIndex].batteryStatus=="normal"
  || children[kidIndex].batteryStatus=="under50")
  {activatePushNotification(token,
    data.children[kidIndex].connectionToken
    +" phone has less then - 20% ")
    children[kidIndex].batteryStatus="under20"
  }


  else if(children[kidIndex].batteryLevel<=50&&children[kidIndex].batteryStatus=="normal")
  {activatePushNotification(token,
    data.children[kidIndex].connectionToken
    +" phone has less then - 50% ")
    data.children[kidIndex].batteryStatus="under50"
  }
///----------

if(children[kidIndex].batteryLevel>=10&&children[kidIndex].batteryStatus=="under10")
{
  children[kidIndex].batteryStatus="under20"
}




else if(children[kidIndex].batteryLevel>=20&&children[kidIndex].batteryStatus=="under20")
{
  children[kidIndex].batteryStatus="under50"
}


else if(children[kidIndex].batteryLevel<50&&children[kidIndex].batteryStatus=="under50")
{
  children[kidIndex].batteryStatus="normal"
}


return children

}





function isInsertEvent(event,children,time,kidIndex)
{
    const today=  new Date();
    const dateOfFirstEvent= new Date(children[kidIndex].events[0]?.time);
    

if( children[kidIndex].events.length!=0)

  { if( today.getDay() == dateOfFirstEvent.getDay()
   && today.getMonth()==dateOfFirstEvent.getMonth()
   &&today.getFullYear()==dateOfFirstEvent.getFullYear())
   children[kidIndex].events.push({event:event,time:time})
   else
   {
    children[kidIndex].events.shift()
    children[kidIndex].events.push({event:event,time:time})
   }
}
else
children[kidIndex].events.push({event:event,time:time})
return children
}



 function updateKidLocationArray(children,connectionToken,
    currentLocation,data,token,batteryLevel,batteryStatus)
{
    let time=new Date().getTime()
    const kidIndex=data.children.findIndex(e=>e.connectionToken==connectionToken)
    if(batteryStatus=="null")
   {
   }
   else {

    children[kidIndex]= checkUpdateBatteryStatus(children[kidIndex],batteryLevel)
   }
    
    children[kidIndex].batteryStatus=
  


   children[kidIndex].batteryLevel=batteryLevel;
  
    console.log(data.children[kidIndex].batteryLevel+"data.children[kidIndex].batteryLevel")
    console.log(kidIndex+"indexKid")
    console.log(children+"start4"+data.children[kidIndex].name)
   let {locationName,event}=setKidsCurrentLocationName(kidIndex,data,token,currentLocation,time)
   console.log(children[kidIndex].childname+"start5")

   console.log("is event happend"+ event)
   console.log("is locationName exist"+ locationName)
       event?children= isInsertEvent(event,children,time,kidIndex):""
    
          
            let obj={latitude:currentLocation.coords.latitude,longitude:currentLocation.coords.longitude,time:time,locationName:locationName}
            



          console.log("obj"+obj.locationName)
          console.log(children[kidIndex].childname+"start6")
            children[kidIndex].location.length<11||children[kidIndex].location.length==0?
            children[kidIndex].location.push(obj):
            (children[kidIndex].location.shift(),children[kidIndex].location.push(obj))
            console.log(children[kidIndex].childname+"start7")


return children
}

function setKidsCurrentLocationName(kidIndex,data,token,currentLocation,time)
{


    let locationName="notInBaseLocation";
    let isHeInStoredLocation=false 
    console.log(data.children[kidIndex].childname+"start1")
  if(!data.children[kidIndex].
    location.length)
{
    for(let i=0;i<data.BaseLocation.length;i++){
        if(distance(data.BaseLocation[i].latitude,currentLocation.coords.latitude,
            data.BaseLocation[i].longitude,currentLocation.coords.longitude
            )<75)
            {
                locationName=data.BaseLocation[i].name
                isHeInStoredLocation=true 
                i=data.BaseLocation.length;
                console.log("start1---"+locationName)
                    return {locationName:locationName};
            }
            

        }
        console.log("222222222222222")
        return {locationName:locationName};

}



  console.log("---"+data.children[kidIndex].childname+"999999999999999999999999")


   if(data.children[kidIndex].
    location[data.children[kidIndex].location.length-1].locationName=="notInBaseLocation")
    {

        for(let i=0;i<data.BaseLocation.length;i++){
        if(distance(data.BaseLocation[i].latitude,currentLocation.coords.latitude,
            data.BaseLocation[i].longitude,currentLocation.coords.longitude
            )<75)
            {
                locationName=data.BaseLocation[i].name
                console.log("out-in"+locationName)
                isHeInStoredLocation=true 
                i=data.BaseLocation.length;
                i=data.BaseLocation.length;
                activatePushNotification(token,
                    data.children[kidIndex].connectionToken
                    +" has entered - "+locationName)

                    return {locationName:locationName,event:data.children[kidIndex].connectionToken
                        +" has entered - "+locationName};//out->in
            }
            

        }
        console.log("out-out"+locationName)
        return {locationName:locationName};//out->out

    }

    


    for(let i=0;i<data.BaseLocation.length;i++){
        if(distance(data.BaseLocation[i].latitude,currentLocation.coords.latitude,
            data.BaseLocation[i].longitude,currentLocation.coords.longitude
            )<75&&data.BaseLocation[i].name!=data.children[kidIndex].
            location[data.children[kidIndex].location.length-1].locationName)
            {
                console.log(data.children[kidIndex].childname+"start2")
                locationName=data.BaseLocation[i].name
                isHeInStoredLocation=true 
                i=data.BaseLocation.length;
                i=data.BaseLocation.length;
                activatePushNotification(token,
                    data.children[kidIndex].connectionToken
                    +" has entered - "+locationName)
                    console.log("in-inOther"+locationName)
                    return {locationName:locationName,event:
                        data.children[kidIndex].connectionToken
                        +" has entered - "+locationName };//in->in other base location- taleport
            }
            else if(distance(data.BaseLocation[i].latitude,currentLocation.coords.latitude,
                data.BaseLocation[i].longitude,currentLocation.coords.longitude
                )<75&&data.BaseLocation[i].name==data.children[kidIndex].
                location[data.children[kidIndex].location.length-1].locationName)
                {console.log("in-in same"+data.BaseLocation[i].name)
                return {locationName:data.BaseLocation[i].name};}//in->in smae base location

        }
        console.log(data.children[kidIndex].childname+"start3")
       
        activatePushNotification(token,
            data.children[kidIndex].connectionToken
            +" left - "+
            data.children[kidIndex].location[data.children[kidIndex]
            .location.length-1].locationName)
            console.log("in-out"+locationName)
            return {locationName:locationName,event: data.children[kidIndex].connectionToken
                +" left - "+
                data.children[kidIndex].location[data.children[kidIndex]
                .location.length-1].locationName}//in->out

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
    const {id,currentLocation,connectionToken,token,batteryLevel,batteryStatus}=req.body;
    let children;
    batteryStatus?batteryStatus=batteryStatus:batteryStatus="null"
    console.log("id")
    User.findOne({_id:id})  
      .then((data) =>data?
      User.findByIdAndUpdate(id, { $set: {children: updateKidLocationArray(data.children,connectionToken,currentLocation,data,token,batteryLevel,batteryStatus)} },

         { new: false }).then( async (data) => {
            // children=data.children;

                    //   activatePushNotification(token,"ss")
                    
                        console.log("emittttttttttttt")
                        await global.io.emit(`${"63738fb9e33a0195e497e318"}`, {children:data.children});
                       await global.io.on('disconnect',()=>{
                           ""
                            })
                     
                   

                    res.json("succsess")

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





  //notifications


  router.post('/childClosedApp', function(req, res, next) {
    const {id,connectionToken,batteryLevel}=req.body;
    let messege;
    let kidIndex;
    console.log("closed")
    User.findOne({_id:id})
      .then((data) =>{
       if(data)
         {kidIndex=data.children.findIndex(e=>e.connectionToken==connectionToken);
         messege=data.children[kidIndex].childname+" closed the app with battery level of : "
         +batteryLevel
        activatePushNotification(connectionToken,messege)
        return
}         
      })
      .catch(next)
      return
  });




  router.post('/childBatteryLevelChange', function(req, res, next) {
    const {id,connectionToken,token,batteryLevel}=req.body;
    User.findOne({_id:id})
      .then((data) =>data? 
      User.findByIdAndUpdate(id, { $set: {children: isBatteryNotifications(data,connectionToken,token,batteryLevel)} },
      { new: false }).then( async (data) => {
  

                 res.json("succsess")

   }).catch(err=>res.json(err))
    
      :"")
      .catch(next)
  });




  module.exports = router;
  
