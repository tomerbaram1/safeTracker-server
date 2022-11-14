// import modules
require('dotenv').config({ path: '.env' });
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const port =  process.env.PORT || 4000;
const rateLimit= require('express-rate-limit')
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


// body
app.get("/",(req,res) =>{
    res.send('Welcome to safeTracker API')
})


// Limit requests from API
const limiter = rateLimit({
    max:1000,
    windowMs: 60 * 60 * 1000,
    message:"too many requests from this API"
})
app.use(limiter)

// routes


app.use((err, req, res, next) => {
    console.log(err);
    next();
  });
  
  //middleware that checks if JWT token exists and verifies it if it does exist.
  //In all the future routes, this helps to know if the request is authenticated or not.
  app.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
  
    var token = req.headers['Authorization'];
  
    if (!token) return next();
  
    token = token.replace('Bearer ', '');
  
    jwt.verify(token, process.env.JWT_SECRET, function(err, user) {
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Please register Log in using a valid email to submit posts'
        });
      } else {
        req.user = user;
        next();
      }
    });
  });
  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });