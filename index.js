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
app.use('/api/register',register)
app.use('/api/login',login)


  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });