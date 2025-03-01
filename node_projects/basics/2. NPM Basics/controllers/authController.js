const userDB={
    users: require('../model/users.json'),
    setUsers: function(data){
        this.users=data;
    } 
}
const bcrypt = require('bcrypt');

const handleLogin = async(req, res)=>{
    const {user,pwd} = req.body;
    if(!user || !pwd) return res.status(400).json({"message" : "Username and password are required"});

    const usr = userDB.users.find(person=> person.username===user);

    if(!usr) return res.status(401).json({"message" : `Provided username ${user} doesnot exist.`});

    try{
    const match = await bcrypt.compare(pwd, usr.password);

    if(match) return res.status(200).json({"message":"Authentication successful!"});
    else return res.status(401).json({"message":`Incorrect password for username ${user}`});
    }catch(err){
        res.status(500).json({"message": err.message});
   
    }
}

module.exports = {handleLogin};