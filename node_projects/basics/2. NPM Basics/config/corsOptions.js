//cross origin resource shairng
//here it is open to the whole public but we dont want that, therefore we should create a whitelist
//app.use(cors());
//syntax : 
// any react app =>  at loopback:PORT

const allowedOrigins=require('./allowedOrigins');

const corsOptions = {
    origin : (origin, callback) => {
        // if(whitelist.indexOf(origin)!==-1 || !origin)
        if(allowedOrigins.indexOf(origin)!==-1 || !origin)
        { callback(null, true);}
        else{
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

module.exports= corsOptions;