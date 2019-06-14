const Employee = require('../models/employee');

//RELATIONAL MODEL
const Client = require('../models/client');
//Validation Library
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

//Validation SCHEMA
const employeeSchema = require('../validation/employee');

exports.Create = function (req, res, next) {
    const data = req.body;
    const clientId = req.params.clientId;
    Joi.validate(data, employeeSchema, (err, value) => {
        if (err) return next(err);

        //First find the user by id
        //now push this newClient to the user clients array === user.clients.push(newPost)
        //now save the user. this will automatically creates the relationship
        //and the newClient will be added into the client table
        Client.findById(clientId, (err, client) => {
            if (err) return next(err);
            if (!client) {
                return res.status(404).json({status: false, message: 'Client not found!'})
            }
            const employee = new Employee(data);
            employee.save().then(employee => {
                client.employees.push(employee);
                client.save(); //This will return another promise
            }).then(() => {
                return res.status(200).send({
                    "success": true,
                    "message": "Data successfully retrieve",
                    employee
                })
            }).catch(err => {
                next(err)
            });
        })
    })
}

exports.Find = (req, res, next) => {
    const currentPage = req.query.page || 1; //page number
    const perPage = req.query.perPage || 10; //total items display per page
    let totalItems; //how many items in the database

    Employee.find()
        .countDocuments()
        .then(count => {
            totalItems = count;
            //This will return a new promise with the posts.
            return Employee.find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage);
        }).then(employees => {
        return res.status(200).json({success: true, employees, totalItems})
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    });
};

exports.FindById = (req, res, next) => {
    let id = req.params.id;

    Employee.findById(id, (err, employee) => {
        if (err) return next(err);
        if (!employee) {
            return res.status(404).json({
                "success": false,
                "message": "Employee not found"
            })
        }
        return res.status(200).send({
            "success": true,
            "message": "Data successfully retrieve",
            employee
        })
    });
};

exports.Update = (req, res, next) => {
    // fetch the request data
    const data = req.body;
    let id = req.param('id');

    //Update the user

    // This would likely be inside of a PUT request, since we're updating an existing document, hence the req.params.todoId.
    // Find the existing resource by ID
    Employee.findByIdAndUpdate(
        // the id of the item to find
        id,
        // the change to be made. Mongoose will smartly combine your existing
        // document with this change, which allows for partial updates too
        data,
        // an option that asks mongoose to return the updated version
        // of the document instead of the pre-updated one.
        {new: true},

        // the callback function
        (err, employee) => {
            // Handle any possible database errors
            if (err) return next(err);
            if (!employee) return res.status(404).json({success: false, message: "Employee not found."});
            return res.send({
                "success": true,
                "message": "Record updated successfully",
                employee
            });
        }
    );
};

exports.Delete = (req, res, next) => {
    let id = req.param('id');

    const schema = Joi.object({
        id: Joi.objectId()
    });

    Joi.validate({id}, schema, (err, value) => {
        if (err) {
            // send a 422 error response if validation fails
            return res.status(422).json({
                success: false,
                message: 'Invalid request data',
                err
            });
        }
        // The "todo" in this callback function represents the document that was found.
        // It allows you to pass a reference back to the client in case they need a reference for some reason.
        Employee.findByIdAndRemove(id, (err, employee) => {
            // As always, handle any potential errors:
            if (err) return next(err);
            if (!employee) return res.status(404).json({success: false, message: "Employee not found."});
            // We'll create a simple object to send back with a message and the id of the document that was removed
            // You can really do this however you want, though.
            return res.send({
                "success": true,
                "message": "Record deleted successfully",
                employee
            });
        });
    });
};

