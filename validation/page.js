const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

// define the validation schema
const schema = Joi.object().keys({

    // name is required
    title: Joi.string().min(4).required(),

    menu: Joi.string().required(),

    description: Joi.string().required(),

});
module.exports = schema;
