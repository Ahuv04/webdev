const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500;
const {logger} = require('./middleware/logEvents');
const errHandler = require('./middleware/errorHandler');
const cors=require('cors');
const { route } = require('./routes/subdir');


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
*/

/*
Middleware in Node.js is a function that acts as an intermediary between the request and response cycles.
now in our case the routing handles can also be called as middleware as they are intermediary between req and response.

mostly in express we use app.use() for middleware 
now this works as watterfall like app.get() wherein if you specify a path therein if path matches it will work n if not only then
it will go to the next line
now for app.use() it will be applicable to all routes that are coded below it
*/

//custom middleware logger to log all requests
//note : builtin middlewares didnot need next but we need it as we need to move on to route handling as well
/*
app.use((req, res, next) =>{
    console.log(`${req.method} \t${req.path}`);
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`,'reqLog.txt');
    
    next();

});
*/

app.use(logger);

//cross origin resource shairng
//here it is open to the whole public but we dont want that, therefore we should create a whitelist
//app.use(cors());
//syntax : 
// any react app =>  at loopback:PORT
const whitelist=['https://www.yoursite.com', 'http://127.0.0.1:5500','http://localhost:3500'];

const corsOptions = {
    origin : (origin, callback) => {
        // if(whitelist.indexOf(origin)!==-1 || !origin)
        if(whitelist.indexOf(origin)!==-1 || !origin)
        { callback(null, true);}
        else{
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

/*
built in function in express to handle urlencoded data
in other worsds for form data : contentType : application/x-www-form-urlencoded
recevives an options 
*/
app.use(express.urlencoded({extended:false}));

//built in middleware for json
app.use(express.json());

//serve static files
//to make files available to public
// applied before route functions so they are 
app.use('/', express.static(path.join(__dirname,'public')));

app.use('/subdir',express.static(path.join(__dirname,'public')));
app.use('/subdir',require('./routes/subdir'));

app.get('^/$|/index(.html)?', (req,res) =>{
//    res.send('Hello world');
//another way to send file
//    res.sendFile('./views/index.html', {root:__dirname});
    res.sendFile(path.join(__dirname,'views','index.html'));
});

app.get('/new-page(.html)?', (req,res) =>{
    res.sendFile(path.join(__dirname,'views','new-page.html'));
});

app.get('/old-page(.html)?', (req,res) =>{
    //res.redirect('/new-page.html'); //302 by default response by express
    //rather do
    res.redirect(301, 'new-page.html');
});

//route handlers
//you can chain more than one methods
app.get('/hello(.html)?', (req,res, next)=>{
    console.log('routing to next function');
    next()
}, (req,res)=>{
    res.send('Hello after being routed');
}
);


//another routing method

const one= (req, res, next) =>{
    console.log(1);
    next();
};

const two= (req, res, next) =>{
    console.log(2);
    next();
};

const three= (req, res) =>{
    console.log(3);
    res.send("Finished");
};

app.get('/chain(.html)?', [one, two, three]);

//some custom stuff for 404
//
// app.use('/') doesnot accept regex so would apply to all but we need only for undefined therefore
/* earlier function
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));