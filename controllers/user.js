const User = require('../models/user');
const bcrypt = require('bcryptjs');

//Validation Library
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

//Validation SCHEMA
// const userSchema = require('../validation/user');

exports.Create = (req, res, next) => {
    const data = req.body;
    const {email, password, passwordConfirmation} = req.body;

    if (!password || !email) {
        return res.status(422).send({success: false, message: 'Provide email and password!'});
    }
    if (password !== passwordConfirmation) {
        return res.status(422).send({
            success: false,
            message: 'Password is not a same as confirmation!'
        });
    }
    User.findOne({email}, async (err, existingUser) => {
        if (err) return next(err);

        if (existingUser) {
            return res.status(422).send({
                success: false,
                message: 'User with this email already exist!'

            });
        }
        //before saving the user to the database. hash password
        await bcrypt.genSalt(10, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(data.password, salt, async function (err, hash) {
                if (err) return next(err);
                // Store hash in your password DB.
                // save the user to the database

                // Update the password of the data
                data.password = hash;
                const user = new User(data);

                user.save(function (err) {
                    if (err) return next(err);
                    return res.status(200).send({
                        "success": true,
                        "message": "Data successfully retrieve",
                        "data": user
                    })
                })
            })
        })

    })
}

exports.Find = (req, res, next) => {
    const {name} = req.body;
    const currentPage = req.query.page || 1; //page number
    const perPage = req.query.perPage || 10; //total items display per page
    let totalItems; //how many items in the database

    console.log(req.params);

    User.find({name: name})
        .countDocuments()
        .then(count => {
            totalItems = count;
            //This will return a new promise with the posts.
            return User.find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage);
        }).then(users => {
        return res.status(200).json({success: true, users, totalItems})
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    });
};

exports.FindById = (req, res, next) => {
    let id = req.params.id;

    User.findById(id, {password: 0}, (err, user) => {
        if (err) return next(err);
        if (!user) {
            return res.status(404).json({
                "success": false,
                "message": "User not found"
            })
        }
        return res.status(200).send({
            "success": true,
            "message": "Data successfully retrieve",
            "data": user
        })
    });
};

exports.Update = (req, res, next) => {
    // fetch the request data
    const data = req.body;
    let id = req.params.id;

    //Update the user

    // This would likely be inside of a PUT request, since we're updating an existing document, hence the req.params.todoId.
    // Find the existing resource by ID
    User.findByIdAndUpdate(
        // the id of the item to find
        id,
        // the change to be made. Mongoose will smartly combine your existing
        // document with this change, which allows for partial updates too
        data,
        // an option that asks mongoose to return the updated version
        // of the document instead of the pre-updated one.
        {new: true},

        // the callback function
        (err, user) => {
            // Handle any possible database errors
            if (err) return next(err);
            if (!user) return res.status(404).send({"success": false, "message": "User not found. please sign up"});
            return res.send({
                "success": true,
                "message": "Record updated successfully",
                "data": user
            });
        }
    );
};

exports.Delete = (req, res, next) => {
    let id = req.param('id');

    const schema = Joi.object({
        id: Joi.objectId()
    });

    Joi.validate({id}, schema, async (err, value) => {
        if (err) {
            // send a 422 error response if validation fails
            return res.status(422).json({
                status: 'error',
                message: 'Invalid request data',
                err
            });
        }
        // The "todo" in this callback function represents the document that was found.
        // It allows you to pass a reference back to the client in case they need a reference for some reason.
        User.findByIdAndRemove(id, (error, user) => {
            // As always, handle any potential errors:
            if (error) return next(error);
            if (!user) return res.status(404).json({success: false, message: "User not found. please sign up."});
            // We'll create a simple object to send back with a message and the id of the document that was removed
            // You can really do this however you want, though.
            return res.send({
                "success": true,
                "message": "Record deleted successfully",
                "data": user
            });
        });
    });
};


//RELATIONAL DATA FIND FUNCTIONS
exports.FindClient = (req, res, next) => {
    // const currentPage = req.query.page || 1; //page number
    // const perPage = req.query.perPage || 10; //total items display per page
    const userId = req.params.userId;
    // let totalItems; //how many items in the database

    User.findById(userId)
        .populate({
            path:'clients',
            model: 'Client'
        })
        .exec(function (err, clients) {
            if (err) return next(err);
            return res.status(200).json({success: true, clients})
        });
};

exports.FindSurveys = (req, res, next) => {

    const userId = req.params.userId;

    User.findById(userId)
        .populate({
            path: 'surveys',
            model: 'Survey'
        })
        .exec(function (err, surveys) {
            if (err) return next(err);
            return res.status(200).json({success: true, surveys})
        });
};

