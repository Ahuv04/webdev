const userDB={
    users: require('../model/users.json'),
    setUsers: function(data){
        this.users=data;
    } 
}

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) =>{
    const {user, pwd}= req.body;
    if(!user || !pwd) return res.status(400).json({"message" : "Username and password are required"});

    //check for duplicate user names
    //response status is conflict
    if(userDB.users.find(person=> person.username===user)) return res.status(409).json({"message" : `Username ${user} already exists`});
    try{
        //hashing password
        //10 is value of salt which is used to make it more secure
        const hashPwd = await bcrypt.hash(pwd,10);
        const newUser = {
            "username" : user,
            "password" : hashPwd
        };
        userDB.setUsers([...userDB.users, newUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..','model','users.json'),
            JSON.stringify(userDB.users)
        );
        console.log(userDB.users);
        res.status(200).json({"message":`Created new user ${user}`});
        
    }catch(err) 
    {
        //server error 500
        res.status(500).json({"message": err.message});
    }
}

module.exports = {handleNewUser};