require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500;
const {logger} = require('./middleware/logEvents');
const errHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');

const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");

//connect to db
connectDB();

const cors=require('cors');
const corsOptions= require('./config/corsOptions');
//also takes regex inputs
/*
this way if someone asked for '/' he would get index but wouldn't get it if
he had asked for index.html
app.get('/', (req,res) =>{

therefore the regex : ^/$|/index.html
^ : starts with
$ : ends with
| : or
(.html)?: makes .html optional

Middleware in Node.js is a function that acts as an intermediary between the request and response cycles.
now in our case the routing handles can also be called as middleware as they are intermediary between req and response.

mostly in express we use app.use() for middleware 
now this works as watterfall like app.get() wherein if you specify a path therein if path matches it will work n if not only then
it will go to the next line
now for app.use() it will be applicable to all routes that are coded below it
custom middleware logger to log all requests
note : builtin middlewares didnot need next but we need it as we need to move on to route handling as well
app.use((req, res, next) =>{
    console.log(`${req.method} \t${req.path}`);
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`,'reqLog.txt');
    
    next();

});
*/

app.use(logger);

//according to cors, set res header as allow credentials
app.use(credentials);
app.use(cors(corsOptions));

/*
built in function in express to handle urlencoded data
in other worsds for form data : contentType : application/x-www-form-urlencoded
recevives an options 
*/
app.use(express.urlencoded({extended:false}));

//built in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
//to make files available to public
// applied before route functions so they are 
app.use('/', express.static(path.join(__dirname,'public')));
app.use('/',require('./routes/root'));

app.use('/subdir',express.static(path.join(__dirname,'public')));
app.use('/subdir',require('./routes/subdir'));

app.use('/register',require('./routes/api/register'));
app.use('/auth',require('./routes/api/auth'));
app.use('/refresh', require('./routes/api/refresh'));
app.use('/logout', require('./routes/api/logout'));

app.use(verifyJWT);
app.use('/employees',require('./routes/api/employees'));

/*
//some custom stuff for 404
//
// app.use('/') doesnot accept regex so would apply to all but we need only for undefined therefore
earlier function
app.get('/*', (req,res)=>{
    //if only sendFile the response code could have been 200 ie successfully sending file
    res.status(404).sendFile(path.join(__dirname,'views','404.html'));
app.all() is more for routing
});
*/
app.all('*', (req,res)=>{
    //if only sendFile the response code could have been 200 ie successfully sending file
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'));
    }else if(req.accepts('json')){
        res.json({error : '404 page not found'});
    }
    else{
        res.type('text').send("404 not found");
    }
});


app.use( errHandler);

mongoose.connection.once('open', ()=>{
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
