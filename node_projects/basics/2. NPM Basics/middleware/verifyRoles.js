const verfiyRoles = (...allowedRoles) => {
    return (req,res,next) =>{
        if(!req?.roles) return res.sednStatus(401);

        const rolesArr = [...allowedRoles];
        console.log(rolesArr);
        console.log(req.roles);
        const result = req.roles.map(role=> rolesArr.includes(role)).find(val=> val===true);
        if(!result) res.sednStatus(401);
        next();
    }
}

module.exports = verfiyRoles;