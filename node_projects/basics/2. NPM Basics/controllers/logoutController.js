const userDB={
    users: require('../model/users.json'),
    setUsers: function(data){
        this.users=data;
    } 
}
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async (req,res) =>{
    const cookies= req.cookies;
    if(!cookies?.jwt) return res.sendstatus(204); //no content

    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;

    const usr = userDB.users.find(person=> person.refreshToken===refreshToken);

    //no user but cookie was there
    if(!usr){
        res.clearCookie('jwwt', {httpOnly : true, sameSite : 'None', secure:true});
        res.sendStatus(204);
    }

    const otherUsers = userDB.users.filter(person=> person.refreshToken!==refreshToken);
    const currUser= {...usr, refreshToken:''};
    userDB.setUsers([...otherUsers, currUser]);

    await fsPromises.writeFile(
        path.join(__dirname,'..','model','users.json'),
        JSON.stringify(userDB.users)
    );

    res.clearCookie('jwwt', {httpOnly : true}); //secure true- only serves on https
    res.sendStatus(204);

}

module.exports ={handleLogout};