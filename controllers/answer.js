const Answer = require('../models/answer');

//RELATIONAL MODEL
const Question = require('../models/question');

//Validation Library
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

//Validation SCHEMA
const answerSchema = require('../validation/answer');

exports.Create = function (req, res, next) {
    const data = req.body;

    const questionId = req.params.questionId;

    Joi.validate(data, answerSchema, (err, value) => {
        if (err) return next(err);
        //First find the user by id
        //now push this newClient to the user clients array === user.clients.push(newPost)
        //now save the user. this will automatically creates the relationship
        //and the newClient will be added into the client table
        Question.findById(questionId, (err, question) => {
            if (err) return next(err);
            if (!question) {
                return res.status(404).json({status: false, message: 'No user found!'})
            }
            const answer = new Answer(data);
            answer.save().then(answer => {
                question.answers.push(answer);
                question.save(); //This will return another promise
            }).then(() => {
                return res.status(200).send({
                    "success": true,
                    "message": "Data successfully retrieve",
                    answer
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

    Answer.find()
        .countDocuments()
        .then(count => {
            totalItems = count;
            //This will return a new promise with the posts.
            return Answer.find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage);
        }).then(answers => {
        return res.status(200).json({success: true, answers, totalItems})
    }).catch(err => {
        next(err)
    });
};

exports.FindById = (req, res, next) => {
    let id = req.params.id;

    Answer.findById(id, (err, answer) => {
        if (err) return next(err);
        if (!answer) {
            return res.status(404).json({
                "success": false,
                "message": "Question not found"
            })
        }
        return res.status(200).send({
            "success": true,
            "message": "Data successfully retrieve",
            answer
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
    Answer.findByIdAndUpdate(
        // the id of the item to find
        id,
        // the change to be made. Mongoose will smartly combine your existing
        // document with this change, which allows for partial updates too
        data,
        // an option that asks mongoose to return the updated version
        // of the document instead of the pre-updated one.
        {new: true},

        // the callback function
        (err, answer) => {
            // Handle any possible database errors
            if (err) return next(err);
            if (!answer) return res.status(404).json({success: false, message: "Answer not found."});
            return res.send({
                "success": true,
                "message": "Record updated successfully",
                answer
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
            res.status(422).json({
                success: false,
                message: 'Invalid request data',
                err
            });
        }
        // The "todo" in this callback function represents the document that was found.
        // It allows you to pass a reference back to the client in case they need a reference for some reason.
        Answer.findByIdAndRemove(id, (err, answer) => {
            // As always, handle any potential errors:
            if (err) return next(err);
            if (!answer) return res.status(404).json({success: false, message: "Answer not found."});
            // We'll create a simple object to send back with a message and the id of the document that was removed
            // You can really do this however you want, though.
            return res.send({
                "success": true,
                "message": "Record deleted successfully",
                answer
            });
        });
    });
};

