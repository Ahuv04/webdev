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

module.exports= corsOptions;