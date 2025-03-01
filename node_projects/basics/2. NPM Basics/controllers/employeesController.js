const data ={
    employees : require('../model/employees.json'),
    setEmployees: function (data) {this.employees = data}
}

const getAllEmployees= (req,res) =>{
    res.status(200).json(data.employees);
}

const createEmployee = (req,res)=>{
    const newEmployee = {
        id : data.employees.length+1,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }

    if(!newEmployee || !newEmployee.lastname)
    {
        return res.status(400).json({"message" : "firstname and lastname are required"});
    }

    const newData = [...data.employees, newEmployee];
    data.setEmployees(newData);

    //201 means created new record
    return res.status(201).json(data.employees);
}

const updateEmployee = (req,res)=>{
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    if(!employee){
        res.status(400).json({"message":`Employee ID ${req.body.id} not found`});
    }

    if(!req.body.firstname && !req.body.lastname) res.status(400).json({"message" : "Please provide field to be updated with employee id"});
    if(req.body.firstname) employee.firstname=req.body.firstname;
    if(req.body.lastname) employee.lastname=req.body.lastname;
    
    const filteredArr = data.employees.filter(emp => emp.id!==parseInt(employee.id));
    const newArr = [...filteredArr, employee];
    //there is no reason to sort it but it will look better after sorting
    data.setEmployees(newArr.sort(
        (a,b) => a.id > b.id ? 1: a.id < b.id? -1 : 0
    ));
    res.status(200).json(data.employees);

}

const deleteEmployee = (req, res)=>{
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    if(!employee){
        res.status(400).json({"message":`Employee ID ${req.body.id} not found`});
    }
    const filteredArr = data.employees.filter(emp => emp.id!==parseInt(employee.id));
    data.setEmployees(filteredArr);
    res.status(200).json(data.employees);
}

const getEmployee = (req,res) =>{
    const employee = data.employees.find(emp => emp.id === parseInt(req.params.id));
    if(!employee){
        res.status(400).json({"message":`Employee ID ${req.body.id} not found`});
    }
    res.status(200).json(employee);
}

module.exports = {getAllEmployees, createEmployee, updateEmployee, deleteEmployee, getEmployee};