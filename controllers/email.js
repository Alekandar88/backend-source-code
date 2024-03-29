const Email = require('../models/email');

//Validation Library
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

//Validation SCHEMA
const emailSchema = require('../validation/email');

exports.Create = function (req, res, next) {
    const data = req.body;
    Joi.validate(data, emailSchema, (err, value) => {
        if (err) return next(err);

        const email = new Email(data);

        email.save(function (err) {
            if (err) return next(err);
            res.status(200).send({
                "success": true,
                "message": "Data successfully retrieve",
                email
            })
        })
    })
}

exports.Find = (req, res, next) => {
    const currentPage = req.query.page || 1; //page number
    const perPage = req.query.perPage || 10; //total items display per page
    let totalItems; //how many items in the database

    Email.find()
        .countDocuments()
        .then(count => {
            totalItems = count;
            //This will return a new promise with the posts.
            return Email.find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage);
        }).then(emails => {
        return res.status(200).json({success: true, emails, totalItems})
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    });
};

exports.FindById = (req, res, next) => {
    let id = req.params.id;

    Email.findById(id, (err, email) => {
        if (err) return next(err);
        if (!email) {
            return res.status(404).json({
                "success": false,
                "message": "Email not found"
            })
        }
        return res.status(200).send({
            "success": true,
            "message": "Data successfully retrieve",
            "data": email
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
    Email.findByIdAndUpdate(
        // the id of the item to find
        id,
        // the change to be made. Mongoose will smartly combine your existing
        // document with this change, which allows for partial updates too
        data,
        // an option that asks mongoose to return the updated version
        // of the document instead of the pre-updated one.
        {new: true},

        // the callback function
        (err, email) => {
            // Handle any possible database errors
            if (err) return next(err);
            if (!email) return res.status(404).json({success: false, message: "Email not found"});
            return res.send({
                "success": true,
                "message": "Record updated successfully",
                email
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
        Email.findByIdAndRemove(id, (err, email) => {
            // As always, handle any potential errors:
            if (err) return next(err);
            if (!email) return res.status(404).json({success: false, message: "Email not found."});
            // We'll create a simple object to send back with a message and the id of the document that was removed
            // You can really do this however you want, though.
            return res.send({
                "success": true,
                "message": "Record deleted successfully",
                email
            });
        });
    });
};

