const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res)=>{
    const cookies= req.cookies;
    if(!cookies?.jwt) return res.status(401).json({"message" : "cookies are required"});

    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;

    const usr = await User.findOne({refreshToken: refreshToken}).exec();

    if(!usr) return res.sendStatus(403); //forbidden

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded)=>{
            if(err || usr.username !== decoded.username)  res.sendStatus(403);
            const roles = usr.roles;
            const accessToken = jwt.sign(
                { 
                    "UserInfo":{
                        "username": usr.username,
                        "roles" :roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn : '30s'}           
                );

            res.json({"accessToken":accessToken});
        }
    );
}

module.exports = {handleRefreshToken};