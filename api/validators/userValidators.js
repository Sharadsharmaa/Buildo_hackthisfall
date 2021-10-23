const { celebrate, Joi } = require('celebrate');

module.exports.loginUser = celebrate({
    body: Joi.object().options({ abortEarly: false }).keys({
        email: Joi.string().required().email({ minDomainSegments: 2 }),
    })
});

module.exports.registerUser = celebrate({
    body: Joi.object().options({ abortEarly: false }).keys({
        name: Joi.any().optional(),
        email: Joi.string().required(),
        company: Joi.any().optional(),
        contact_no: Joi.any().optional(),
        city: Joi.any().optional(),
        state: Joi.any().optional(),
        country: Joi.any().optional(),
        pincode: Joi.any().optional(),
        address: Joi.any().optional(),
    })
});


module.exports.updateProfilePic = celebrate({
    body: Joi.object().options({ abortEarly: false }).keys({
        id: Joi.number().required(),
        profile_pic: Joi.string().required(),
    })
});


