const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    state: {
        type: String,
    },
    country: {
        type: String
    },
    workforce: {
        type: Number
    },
    //Aggregate data only  Individual + Aggregate Data
    org_mgt: {
        type: String,
    },
    div_mgt: {
        type: String
    },
    dept_mgt:{
      type: String
    },
    turnover: {
        type: Number,
        required: true
    },
    is_aggregate_reports: {
        type: Boolean,
    },
    surveys: [{type: Schema.Types.ObjectId, ref: 'Survey'}],

    industry: {type: Schema.Types.ObjectId, ref: 'Industry'},

    employees: [{type: Schema.Types.ObjectId, ref: 'Employee'}],

    organizations: [{type: Schema.Types.ObjectId, ref: 'Organization'}]

}, {timestamps: true});

module.exports = mongoose.model('Client', clientSchema);