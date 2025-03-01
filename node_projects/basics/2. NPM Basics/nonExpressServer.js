const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
//logEvent export
const logEvents = require('./logEvents');

//port for server to run onto
const PORT = process.env.PORT || 3500;

//emitter class module that is available for use
const EventEmitter = require('events');

//we define a personal class that extends eventemitter class
class Emitter extends EventEmitter{};
const myEmitter= new Emitter();
//we define the emitter.on function wherein we add 'log' and msg as 2 arguments
myEmitter.on('log', (msg, fileName)=> logEvents(msg, fileName));

const serveFile= async(filePath, contentType, response) => {

    try{
        let rawData = await fsPromises.readFile(filePath,
            !contentType.includes('image') ? 'utf-8' : '');
        
        const data = contentType === 'application/json'
            ? JSON.parse(rawData) : rawData;
        response.writeHead(
            filePath.includes('404.html') ? 404 : 200,
            { 'Content-Type': contentType });
        response.write(
            contentType==='application/json'? JSON.stringify(data): data);
            //add something
        response.end();

    }catch(err){
        console.log(err);
        myEmitter.emit('log', `${err.name}: ${err.message}`, 'errLog.txt');
        response.statusCode = 500;
        response.end();
    }

}

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);

    myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt');

    const extension = path.extname(req.url);
    let contentType;


    switch (extension){
        case '.css':
            contentType='text/css';
            break;
        case '.js':
            contentType='text/javascript';
            break;
        case '.json':
            contentType='application/json';
            break;
        case '.jpg':
            contentType='image/jpeg';
            break;
        case '.png':
            contentType='image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';     
    }

    let filePath = contentType==='text/html' && req.url==='/' 
                ? path.join(__dirname,'views','index.html')
                : contentType==='text/html' && req.url.slice(-1)=='/'
                ? path.join(__dirname,'views',req.url,'index.html')
                : contentType==='text/html'
                ? path.join(__dirname,'views',req.url)
                : path.join(__dirname,req.url);

    if (!extension && req.url.slice(-1) !== '/') filePath += '.html';

    const fileExists = fs.existsSync(filePath);

    if(fileExists)
    {
        serveFile(filePath, contentType, res);
    }
    else{
        switch (path.parse(filePath).base) {
            case 'old-page.html':
                res.writeHead(301, { 'Location': '/new-page.html' });
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301, { 'Location': '/' });
                res.end();
                break;
            default:
                serveFile(path.join(__dirname,'views','404.html'), 'text/html' ,res);
        };
    }
}
);

server.listen(PORT, () => console.log(`Server running on port on ${PORT}`));

/*


setTimeout(() =>{
    //emit event
    //this function has arguments defined in .on function
    myEmitter.emit('log', 'Log event emitted!');
}, 2000);

*/