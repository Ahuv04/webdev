const Employee = require('../model/Employee');

const getAllEmployees= async (req,res) =>{
    const employees = await Employee.find();
    if(!employees) return res.status(204).json({'messages':'No Employees found'});
    res.status(200).json(employees);
}

const createEmployee = async (req,res)=>{
    if(!req?.body?.firstname || !req?.body?.firstname) {
        res.status(400).json({"message" : "firstname and lastname are required"});
    }

    try{
        const newEmployee = new Employee({
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });
        const result = await Employee.create(newEmployee);
        // const employees = await Employee.find();
        return res.status(201).json(result);
    }catch(err){
        console.error(err);
    }
    //201 means created new record
}

const updateEmployee = async (req,res)=>{
    if(!req?.body?.id) {
        res.status(400).json({"message":`No Employee ID found in Body`});
    }

    const employee = await Employee.findOne({_id : req.body.id}).exec();
    
    if(!employee){
        res.status(400).json({"message":`Employee ID ${req.body.id} not found`});
    }

    if(!req.body.firstname && !req.body.lastname) res.status(400).json({"message" : "Please provide field to be updated with employee id"});
    if(req.body.firstname) employee.firstname=req.body.firstname;
    if(req.body.lastname) employee.lastname=req.body.lastname;
    
    const result = await employee.save();
    res.status(200).json(result);
}

const deleteEmployee = async (req, res)=>{
    if(!req?.body?.id) {
        return res.status(400).json({"message":`No Employee ID found in Body`});
    }

    const employee = await Employee.findOne({_id : req.body.id}).exec();

    if(!employee){
        return res.status(400).json({"message":`Employee ID ${req.body.id} not found`});
    }

    const result = await Employee.deleteOne({_id : req.body.id});
    return res.status(200).json(result);
}

const getEmployee = async (req,res) =>{
    if(!req?.params?.id) {
        return res.status(400).json({"message":`No Employee ID found in Body`});
    }
    const employee = await Employee.findOne({_id : req.params.id}).exec();

    if(!employee){
        res.status(400).json({"message":`Employee ID ${req.params.id} not found`});
    }
    return res.status(200).json(employee);
}

module.exports = {getAllEmployees, createEmployee, updateEmployee, deleteEmployee, getEmployee};