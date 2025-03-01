const express = require('express');
const app = express();

const path = require('path');
const PORT = process.env.PORT || 3500;


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


app.get('/*', (req,res)=>{
    //if only sendFile the response code could have been 200 ie successfully sending file
    res.status(404).sendFile(path.join(__dirname,'views','404.html'));

});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));