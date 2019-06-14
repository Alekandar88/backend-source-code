const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const industrySchema = new Schema({
    name: {
        type: String,
        required: true
    }
}, {timestamps: true});

// surveySchema.pre('remove', function (next) {
//     // 'this' is the client being removed. Provide callbacks here if you want
//     // to be notified of the calls' result.
//     //update the client table industry accordingly
//     User.remove({role: this._id}).exec();
//     next();
// });

module.exports = mongoose.model('Industry', industrySchema);