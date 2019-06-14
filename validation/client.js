const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const any = Joi.any();

// define the validation schema
const schema = Joi.object().keys({

    // name is required
    name: Joi.string().required(),

    state: Joi.string().required(),

    country: Joi.string().required(),

    org_mgt : any.valid(['Aggregate Data Only', 'Individual + Aggregate Data']),

    div_mgt : any.valid(['Aggregate Data Only', 'Individual + Aggregate Data']),

    dept_mgt : any.valid(['Aggregate Data Only', 'Individual + Aggregate Data']),

    turnover: Joi.number().integer(),

    industry: Joi.objectId(),

    is_aggregate_reports: Joi.bool().required()


});
module.exports = schema;
