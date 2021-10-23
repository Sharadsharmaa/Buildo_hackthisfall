const { celebrate, Joi } = require('celebrate');

module.exports.login = celebrate({
    body: Joi.object().options({ abortEarly: false }).keys({
        email: Joi.string().required().email({ minDomainSegments: 2 }),
        password: Joi.string().required()
    })
});

module.exports.forgotPassword = celebrate({
    body: Joi.object().options({ abortEarly: false }).keys({
        email: Joi.string().required().email({ minDomainSegments: 2 }),
    })
});
module.exports.resetPassword = celebrate({
    body: Joi.object().options({ abortEarly: false }).keys({
        token: Joi.string().required(),
        password: Joi.string().required(),
        cpassword: Joi.string().required()
    })
});

module.exports.createAdmin = celebrate({
    body: Joi.object().options({ abortEarly: false }).keys({
        role_id: Joi.string().required(),
        name: Joi.string().required().max(30),
        email: Joi.string().required().email({ minDomainSegments: 2 }),
        mobile: Joi.string().required().max(30),
    })
});


module.exports.updateAdmin = celebrate({
    body: Joi.object().options({ abortEarly: false }).keys({
        name: Joi.string().required().max(30),
        email: Joi.string().required().max(30),
        id: Joi.string().required(),
        role_id: Joi.string().required(),
        mobile: Joi.string().required().max(30),
    })
});

module.exports.addRole = celebrate({
    body: Joi.object().options({ abortEarly: false }).keys({
        name: Joi.string().required(),
        modules: Joi.string().required()
    })
});
module.exports.updateRole = celebrate({
    body: Joi.object().options({ abortEarly: false }).keys({
        id: Joi.string().required(),
        name: Joi.string().required(),
        modules: Joi.string().required()
    })
});

module.exports.deleteRole = celebrate({
    query: Joi.object().options({ abortEarly: false }).keys({
        id: Joi.string().required()
    })
});


module.exports.deleteAdmin = celebrate({
    query: Joi.object().options({ abortEarly: false }).keys({
        id: Joi.string().required()
    })
});

module.exports.editRole = celebrate({
    query: Joi.object().options({ abortEarly: false }).keys({
        id: Joi.string().required()
    })
});
module.exports.editAdmin = celebrate({
    query: Joi.object().options({ abortEarly: false }).keys({
        id: Joi.string().required()
    })
});


module.exports.addProject = celebrate({
    body: Joi.object().options({ abortEarly: false }).keys({
        name: Joi.string().required(),
        type: Joi.string().required(),
        usage: Joi.string().required(),
        measurement_type: Joi.string().required(),
        measurement_unit: Joi.string().required(),
        logo: Joi.string().required()
    })
});
module.exports.editProject = celebrate({
    query: Joi.object().options({ abortEarly: false }).keys({
        id: Joi.string().required()
    })
});
module.exports.updateProject = celebrate({
    body: Joi.object().options({ abortEarly: false }).keys({
        id: Joi.string().required(),
        name: Joi.string().required(),
        type: Joi.string().required(),
        usage: Joi.string().required(),
        measurement_type: Joi.string().required(),
        measurement_unit: Joi.string().required(),
        logo: Joi.string().required()
    })
});

module.exports.deleteProject = celebrate({
    query: Joi.object().options({ abortEarly: false }).keys({
        id: Joi.string().required()
    })
});







