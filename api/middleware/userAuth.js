const jwt = require('jsonwebtoken')
const config = require('../config/config');
const User = require('../models/user');
const UserToken = require('../models/user_token');
const auth = async (req, res, next) => {
    try {
        if (req.header('Authorization')) {
            const token = req.header('Authorization').replace('Bearer ', '');
            const data = jwt.verify(token, config.secretKey);
            const user = await User.findOne({ _id: data._id });
            if (user) {
                const session = await UserToken.findOne({ user_id: data._id, token });
                if (session) {
                    req.user = user;
                    req.token = token;
                    next();
                } else {
                    throw new Error();
                }
            } else {
                throw new Error();
            }
        } else {
            throw new Error();
        }
    } catch (error) {
        console.log(error)
        res.status(401).send({ statusCode :401,message: 'Not authorized to access this resource' })
    }
}
module.exports = auth