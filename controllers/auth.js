const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require('../models/user');

//Config
const config = require('../config');

// AuthController responsibility is login, logout, generate a new token, delete a token from the server

/**
 * this is used to authenticate user to our api using email and password
 * POST api/v1/user/login
 * @param req
 * @param res
 */

exports.login = function (req, res, next) {

    const {email, password} = req.body;
    /**
     * this is param checking if they are provided
     */
    if (!password || !email) {
        return res.status(422).send({errors: [{title: 'Data missing!', detail: 'Provide email and password!'}]});
    }

    /**
     * check if the username matches any email
     */

    User.findOne({email}).then((user, err) => {
        if (err) throw new Error("Unable to find user with the email " + email);

        if (!user) {
            const error = new Error("User not found, please sign up.");
            error.statusCode = 401;
            throw error
        }
        //check if the entered password is correct
        bcrypt.compare(password, user.password, function (error, matched) {
            if (error) return next(error);

            if (!matched) {
                const error = new Error("Invalid password.");
                error.statusCode = 400;
                return next(error)
            }

            //save the date the token was generated for already inside toJSON()

            delete user.password;

            let token = jwt.sign(user.toJSON(), config.SECRET, {
                expiresIn: '10m'
            });

            //return the token here
            res.json(token);
        });
    }).catch(err => {
        next(err)
    });
}

/**
 * this is used to request for another token when the other token is about
 * expiring so for next request call the token can be validated as true
 * GET /api/v1/user/token
 * @param req
 * @param res
 */

exports.token = function (req, res) {
    User.findOne(req.user.id).then((error, user) => {
        if (error) throw error;
        if (!user) {
            const error = new Error("User not found, please sign up.");
            error.statusCode = 422;
            throw error
        }

        const token = jwt.sign(user, "this is my secret key", {
            expiresIn: '10m'
        });
        res.json(token);
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    })
}

/**
 * this is used to request for another token when the other token is about
 * expiring so for next request call the token can be validated as true
 * GET /api/v1/user/logout
 * @param req
 * @param res
 */
exports.refresh = function (req, res) {
    // request a new token
    res.send({message: "refresh"})
}

