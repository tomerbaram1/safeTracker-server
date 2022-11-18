// import modules
require('dotenv').config({ path: '.env' });
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const port =  process.env.PORT || 4000;
const rateLimit= require('express-rate-limit')
const register = require('./routes/register')
const login = require('./routes/login')
const map =require('./routes/maps')



///socket
var socket = require('socket.io');


var server = app.listen(4000, function(){
    console.log('listening for requests on port 4000,');
});


let io = require('socket.io')(server);
// const map = require('./routes/maps')(io);



io.on('connection', function(socket){
  console.log(`${socket.id} is connected`)
  
  socket.on('join', () => {
    socket.join(socket.id)
    console.log(`user ${socket.id} joined room ${socket.id}`);
  })


console.log("***")
  socket.on('disOn', (location,id) => {
    console.log("on")
    socket.emit('disTo', getDis(location,String(id)))
    console.log(`user ${socket.id} joined room ${socket.id}`);
  })
 

socket.on('disconnect',()=>{
  console.log("user"+socket.id+" disconnected")
})


});
app.io=io
global.io = io
/// socket end







// DB
mongoose.connect(process.env.DB,{
    useNewUrlParser:true,
    useUnifiedTopology: true,

}).then(()=>console.log("Connected To Database!"))
.catch((err)=>console.log('Could not connect to database',err.message));

// middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  app.use(cors())
  app.use(bodyParser.json());
  app.use((morgan("dev")))
  app.use(function(req,res,next){
    req.io = io;
    next();
    })



// Limit requests from API
const limiter = rateLimit({
    max:1000,
    windowMs: 60 * 60 * 1000,
    message:"too many requests from this API"
})
app.use(limiter)

// routes
app.use('/api/register',register)
app.use('/api/login',login)
app.use('/api-map',map)

  
  // app.listen(port, () => {
  //   console.log(`Server running on port ${port}`);
  // });

  function emitKidsLocation(room,childerenArray){
    socket.emit(room, childerenArray);

  }