const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    title: {
        type: String,
        required: true
    },
    number_of_options: {
        type: Number,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    options: [{
        type: String
    }],
    //Multiple-Choice, Dropdown, Checkboxes, Star-Rating, Comment-Box, Date
    type: {
        type: String,
        required: true
    },
    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    answers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Answer'
        }
    ]

}, {timestamps: true});
// surveySchema.pre('remove', function (next) {
//     // 'this' is the client being removed. Provide callbacks here if you want
//     // to be notified of the calls' result.
//     //update the survey table questions accordingly
//     Question.remove({questions: this._id}).exec();
//     next();
// });

module.exports = mongoose.model('Question', questionSchema);