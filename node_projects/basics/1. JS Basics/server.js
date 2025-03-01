//console.log(global)

const os = require('os');
const path= require('path');

//pulling as part of math class
const math = require('./math');
//can also be accessed in destructured way
// const {add, subs, multiply, divide} = require('./math') 

const someFunc = async() =>{
console.log(os.type())
console.log(os.version())
console.log(__dirname)
console.log(__filename)
console.log(path.dirname(__filename))
console.log(path.parse(__filename))
console.log(math.add(2,3))
}

const fs = require('fs');
const fsPromises = require('fs').promises;

//Note : all calls are async therefore you dont know which operation will complete first
const fileayncop = async() => {
//reading file
//args => path, file_encoding, callback
//the callback are executed asyncronously thus callback is given
//the js rte would just read this and async call the callback to execute 
//while main thread will continue to execute ahead
fs.readFile(path.join(__dirname,'files','dummy.txt'),'utf8' ,(err, data)=>{
    if(err) throw err;
    //here data wll come as buffer data(without encoding input)
    console.log(data);
    //print in string format
    console.log(data.toString());
});

console.log('okay');

//overwrite file
//args => pathname, data to write, callback
fs.writeFile(path.join(__dirname,'files', "reply.txt"), "Writing in a file.", (err) => {
    if(err) throw err;
    console.log("write complete");

    //adding append inside callback
    fs.appendFile(path.join(__dirname,'files',"reply.txt"), "\n\nAppending in a file.", (err) => {
        if(err) throw err;
        console.log("Append complete");
    }
    );
}
);

//modify existing file, create one if not present
//args => pathname, data to write, callback
fs.appendFile(path.join(__dirname, 'files',"append.txt"), "Appending in a file.", (err) => {
    if(err) throw err;
    console.log("Append complete");

    fs.rename(path.join(__dirname,'files', "append.txt"), "renamed.txt", (err)=>{
        if(err) throw err;
        console.log("rename complete");
    }    
    );
}
);
}

//catching it in syncrhonous way

const fileOps= async() =>{
    try{
        const data = await fsPromises.readFile(path.join(__dirname,'files','dummy.txt'),'utf8');
        console.log(data);
        await fsPromises.writeFile(path.join(__dirname,'files','promise_data.txt'),data);
        await fsPromises.appendFile(path.join(__dirname,'files','promise_data.txt'),'\n\nGood Stuff');
        const newData = await fsPromises.readFile(path.join(__dirname,'files','promise_data.txt'), 'utf8');
        console.log(newData);
    }catch(err){
        console.error(err);
    }
}

fileOps();
