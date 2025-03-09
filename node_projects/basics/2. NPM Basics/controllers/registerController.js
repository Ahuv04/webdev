const User = require('../model/User');

const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) =>{
    const {user, pwd}= req.body;
    if(!user || !pwd) return res.status(400).json({"message" : "Username and password are required"});

    //check for duplicate user names
    //response status is conflict
    const duplicate = await User.findOne({username: user}).exec();
    if(duplicate) return res.status(409).json({"message" : `Username ${user} already exists`});
    try{
        //hashing password
        //10 is value of salt which is used to make it more secure
        const hashPwd = await bcrypt.hash(pwd,10);
        
        //create and store user in mongoDB
        const newUser = new User({
            "username" : user,
            "password" : hashPwd
        });

        //you can also directly input data to user.create
        const result = await User.create(newUser);

        console.log(result);
        res.status(200).json({"message":`Created new user ${user}`});
        
    }catch(err) 
    {
        //server error 500
        res.status(500).json({"message": err.message});
    }
}

module.exports = {handleNewUser};