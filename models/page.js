const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pageSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    menu: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    boxes:[{
        type:Schema.Types.ObjectId,
        ref:'Box'
    }]
}, {timestamps: true});

module.exports = mongoose.model('Page', pageSchema);