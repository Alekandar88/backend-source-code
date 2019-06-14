const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

// define the validation schema
const schema = Joi.object().keys({

    // name is required
    title: Joi.string().min(4).required(),

    subtitle: Joi.string().required(),

    author: Joi.string().required(),

    keywords: Joi.string().required(),

    description: Joi.string().required(),

    user: Joi.objectId()

});
module.exports = schema;
