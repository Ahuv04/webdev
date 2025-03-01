/*

nodemon package - monitors js files and restarts server when files modified
date-fns : date functions package
uuid : create ids

*/

const {format} = require('date-fns');
//import v4 in uuid as uuid
const {v4:uuid} = require('uuid');

const fs= require('fs');
const fsPromises = require('fs').promises;
const path = require('path');


const logEvents= async(message, fileName) =>{
    const dateTime = `${format(new Date(), 'yyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    console.log(logItem);
    try{
        if(!fs.existsSync(path.join(__dirname,'logs')))
        {   await fsPromises.mkdir(path.join(__dirname, 'logs'));

        }
        await fsPromises.appendFile(path.join(__dirname,'logs', fileName),logItem);

    }catch(err)
    {
        console.log(err);
    }
}


module.exports=logEvents;