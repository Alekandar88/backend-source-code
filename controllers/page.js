const Page = require('../models/page');

//Validation Library
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

//Validation SCHEMA
const pageSchema = require('../validation/page');

exports.Create = function (req, res, next) {
    const data = req.body;
    Joi.validate(data, pageSchema, (err, value) => {
        if (err)  return next(err);

        const page = new Page(data);

        page.save(function (err) {
            if (err) return next(err);
            return res.status(200).send({
                "success": true,
                "message": "Record successfully created",
                page
            })
        })
    })
}

exports.Find = (req, res, next) => {
    const currentPage = req.query.page || 1; //page number
    const perPage = req.query.perPage || 10; //total items display per page
    let totalItems; //how many items in the database

    Page.find()
        .countDocuments()
        .then(count => {
            totalItems = count;
            //This will return a new promise with the posts.
            return Page.find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage);
        }).then(pages => {
        return res.status(200).json({success: true, pages, totalItems})
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    });
};

exports.FindById = (req, res, next) => {
    let id = req.params.id;

    Page.findById(id, (err, page) => {
        if (err) return next(err);
        if (!page) {
            return res.status(404).json({
                "success": false,
                "message": "Page not found"
            })
        }
        return res.status(200).send({
            "success": true,
            "message": "Data successfully retrieve",
            page
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
    Page.findByIdAndUpdate(
        // the id of the item to find
        id,
        // the change to be made. Mongoose will smartly combine your existing
        // document with this change, which allows for partial updates too
        data,
        // an option that asks mongoose to return the updated version
        // of the document instead of the pre-updated one.
        {new: true},

        // the callback function
        (err, page) => {
            // Handle any possible database errors
            if (err) return next(err);
            if (!page) return res.status(404).json({success: false, message: "Page not found."});
            return res.send({
                "success": true,
                "message": "Record updated successfully",
                page
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
        Page.findByIdAndRemove(id, (err, page) => {
            // As always, handle any potential errors:
            if (err) return next(err);
            if (!page) return res.status(404).json({success: false, message: "Page not found."});
            // We'll create a simple object to send back with a message and the id of the document that was removed
            // You can really do this however you want, though.
            return res.send({
                "success": true,
                "message": "Record deleted successfully",
                page
            });
        });
    });
};

