const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Question = require('./question');

const surveySchema = new Schema({

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    instruction: {
        type: String,
        required: true
    },
    no_of_questions: {
        type: Number,
        required: true
    },

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    questions: [{
        type: Schema.Types.ObjectId,
        ref: 'Question'
    }],
    ratings: [{
        type: Schema.Types.ObjectId,
        ref: 'Rating'
    }]
}, {timestamps: true});

// surveySchema.pre('remove', function (next) {
//     // 'this' is the client being removed. Provide callbacks here if you want
//     // to be notified of the calls' result.
//     //delete all the related questions
//     Question.remove({questions: this._id}).exec();
//     next();
// });
module.exports = mongoose.model('Survey', surveySchema);