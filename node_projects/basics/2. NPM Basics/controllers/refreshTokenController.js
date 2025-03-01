const userDB={
    users: require('../model/users.json'),
    setUsers: function(data){
        this.users=data;
    } 
}
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = (req, res)=>{
    const cookies= req.cookies;
    if(!cookies?.jwt) return res.status(401).json({"message" : "cookies are required"});

    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;

    const usr = userDB.users.find(person=> person.refreshToken===refreshToken);

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