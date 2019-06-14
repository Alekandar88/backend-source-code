const Survey = require('../models/survey');

//RELATIONAL MODEL

const User = require('../models/user');

//Validation Library
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

//Validation SCHEMA
const surveySchema = require('../validation/survey');

exports.Create = function (req, res, next) {
    const data = req.body;

    const userId = req.params.userId;

    Joi.validate(data, surveySchema, (err, value) => {
        if (err) return next(err);
        //First find the user by id
        //now push this newSurvey to the user surveys array === user.surveys.push(newPost)
        //now save the user. this will automatically creates the relationship
        //and the newSurvey will be added into the survey table
        User.findById(userId, (err, user) => {
            if (err) return next(err);
            if (!user) {
                return res.status(404).json({status: false, message: 'No user found!'})
            }
            const survey = new Survey(data);
            console.log(user);
            survey.save().then(survey => {
                user.surveys.push(survey);
                user.save(); //This will return another promise
            }).then(() => {
                return res.status(200).send({
                    "success": true,
                    "message": "Data successfully retrieve",
                    "data": survey
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

    Survey.find()
        .countDocuments()
        .then(count => {
            totalItems = count;
            //This will return a new promise with the posts.
            return Survey.find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage);
        }).then(surveys => {
        return res.status(200).json({success: true, surveys, totalItems})
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    });
};

exports.FindById = (req, res, next) => {
    let id = req.params.id;

    Survey.findById(id, (err, survey) => {
        if (err) return next(err);
        if (!survey) {
            return res.status(404).json({
                "success": false,
                "message": "Survey not found"
            })
        }
        return res.status(200).send({
            "success": true,
            "message": "Data successfully retrieve",
            survey
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
    Survey.findByIdAndUpdate(
        // the id of the item to find
        id,
        // the change to be made. Mongoose will smartly combine your existing
        // document with this change, which allows for partial updates too
        data,
        // an option that asks mongoose to return the updated version
        // of the document instead of the pre-updated one.
        {new: true},

        // the callback function
        (err, survey) => {
            // Handle any possible database errors
            if (err) return next(err);
            if (!survey) return res.status(404).json({success: false, message: "Survey not found."});
            return res.send({
                "success": true,
                "message": "Record updated successfully",
                survey
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
                status: 'error',
                message: 'Invalid request data',
                err
            });
        }
        // The "todo" in this callback function represents the document that was found.
        // It allows you to pass a reference back to the survey in case they need a reference for some reason.
        Survey.findByIdAndRemove(id, (err, survey) => {
            // As always, handle any potential errors:
            if (err) return next(err);
            if (!survey) return res.status(404).json({success: false, message: "Survey not found."});
            // We'll create a simple object to send back with a message and the id of the document that was removed
            // You can really do this however you want, though.
            return res.send({
                "success": true,
                "message": "Record deleted successfully",
                survey
            });
        });
    });
};

