const User = require('../model/User')

const fsPromises = require('fs').promises;

const handleLogout = async (req,res) =>{
    const cookies= req.cookies;
    if(!cookies?.jwt) return res.sendstatus(204); //no content

    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;

    const usr = await User.findOne({refreshToken:refreshToken}).exec();

    //no user but cookie was there
    if(!usr){
        res.clearCookie('jwt', {httpOnly : true, sameSite : 'None', secure:true});
        res.sendStatus(204);
    }

    const result = await User.updateOne({refreshToken:refreshToken},{$unset: {refreshToken: refreshToken}});
    console.log(result);

    res.clearCookie('jwt', {httpOnly : true}); //secure true- only serves on https
    res.sendStatus(204);

}

module.exports ={handleLogout};