const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        min: [4, 'Too short, min is 4 characters'],
        max: [32, 'Too long, max is 32 characters'],
        unique: true,
        lowercase: true,
        required: 'Email is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password: {
        type: String,
        min: [4, 'Too short, min is 4 characters'],
        max: [32, 'Too long, max is 32 characters'],
        required: 'Password is required'
    },
    position: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    mobile: {
        type: String
    },
    date_of_birth: {
        type: Date,
        required: true
    },
    hire_date: {
        type: Date
    },
    resign_date: {
        type: Date
    },
    exit_date: {
        type: Date
    },
    is_active: {
        type: Boolean,
        required: true
    },
    is_survey: {
        type: Boolean,
        required: true
    },
    is_online: {
        type: Boolean,
        required: true
    },
    is_report: {
        type: Boolean,
        required: true
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'Organization'
    }
}, {timestamps: true});

module.exports = mongoose.model('Employee', employeeSchema);