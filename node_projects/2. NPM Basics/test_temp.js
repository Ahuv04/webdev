const data = {
    employees: require('./model/employees.json'),
    setEmployees : function(data){ this.employees=data;}
}

const createEmployee= (req, res) => {
    const newEmployee = {
        id : data.employees.length+1,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }

    if(!newEmployee || !newEmployee.lastname)
    {
        return res.status().;
    }

    data = {...data, n};
    data.setEmployees(data);


}