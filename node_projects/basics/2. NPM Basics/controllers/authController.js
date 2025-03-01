const userDB={
    users: require('../model/users.json'),
    setUsers: function(data){
        this.users=data;
    } 
}
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');


const handleLogin = async(req, res)=>{
    const {user,pwd} = req.body;
    if(!user || !pwd) return res.status(400).json({"message" : "Username and password are required"});

    const usr = userDB.users.find(person=> person.username===user);

    if(!usr) return res.status(401).json({"message" : `Provided username ${user} doesnot exist.`});

    try{
    const match = await bcrypt.compare(pwd, usr.password);

    if(match) {
        //create JWTs
        //this is available to all if they get access to token
        const roles = Object.values(usr.roles);

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
        const refreshToken = jwt.sign(
            {"username": usr.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn : '1d'}            
            );

        const otherUsers= userDB.users.filter(person=> person.username!==usr.username);
        const currentUser = {...usr, refreshToken};
        userDB.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname,'..','model','users.json'),
            JSON.stringify(userDB.users)
        );
        //token not secure in local memory, accessToken can be saved in memory but refreshToken should be stored in a cookie that is not available via js(httponlytoekn)
        res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', secure:true, maxAge: 24*60*60*1000});
        res.json({"accessToken":accessToken});
    }
    else return res.status(401).json({"message":`Incorrect password for username ${user}`});
    }catch(err){
        res.status(500).json({"message": err.message});
   
    }
}

module.exports = {handleLogin};