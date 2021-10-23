const httpStatus = require("http-status-codes");
const User = require('../../models/user');
const UserToken = require('../../models/user_token');
const UserPWDToken = require('../../models/user_password_token');
const global = require('../../resources/lang/en/global');
const responseManagement = require('../../lib/responseManagement');

/****** Login ****/
module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            if (!user.provider_id || !user.provider_type) {
                if (user.validPassword(password)) {
                    if (user.status) {
                        const token = await user.generateJWT();
                        var req_ip = req.connection.remoteAddress.split(":")[3] || '';
                        let atoken = new UserToken({ admin_id: user.id, token, req_ip, user_agent: req.headers['user-agent'] });
                        const result = await atoken.save();
                        const user_data = {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            mobile: user.mobile,
                            profile_setup: user.profile_setup

                        };
                        responseManagement.sendResponse(res, httpStatus.OK, global.logged_in_successful, { "token": token, user_data })

                    } else {
                        responseManagement.sendResponse(res, httpStatus.UNAUTHORIZED, global.user_is_inactive);
                    }
                } else {
                    responseManagement.sendResponse(res, httpStatus.BAD_REQUEST, global.invalid_credentials);
                }
            } else {
                responseManagement.sendResponse(res, httpStatus.BAD_REQUEST, `You are previously loggedin as ${user.provider_type}. Please use that only for login.`);
            }
        } else {
            responseManagement.sendResponse(res, httpStatus.BAD_REQUEST, global.invalid_credentials);
        }
    } catch (error) {
        console.log(error)
        responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, global.internal_server_error);
    }
};


/****** sawo Login ****/
/**
  * @swagger
  * tags:
  *   name: User
  *   description: The books managing API
  */

/**
 * @swagger
 * /api/v1/user/sawoLogin:
 *   post:
 *     summary: Returns the list of all the books
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The list of the books
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/User'
*/
module.exports.sawoLogin = async (req, res) => {
    try {
        const { email, provider_type, provider_id, name } = req.body;
        const user = await User.findOne({ provider_id, provider_type });
        if (user) {
            await User.updateOne({ _id: user._id }, { name });
            const token = await user.generateJWT();
            var req_ip = req.connection.remoteAddress.split(":")[3] || '';
            await UserToken.create({ user_id: user._id, token, req_ip, user_agent: req.headers['user-agent'] });
            const user_data = {
                _id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                profile_setup: user.profile_setup
            };
            responseManagement.sendResponse(res, httpStatus.OK, global.logged_in_successful, { token: token, user_data })
        } else {
            const uuser = await User.findOne({ email });
            if (uuser) {
                responseManagement.sendResponse(res, httpStatus.BAD_REQUEST, global.email_already_exist);
            } else {
                const nuser = await User.create({ provider_type, provider_id, email, name });
                const token = await nuser.generateJWT();
                var req_ip = req.connection.remoteAddress.split(":")[3] || '';
                const result = await UserToken.create({ user_id: nuser._id, token, req_ip, user_agent: req.headers['user-agent'] });
                responseManagement.sendResponse(res, httpStatus.OK, global.logged_in_successful, { token: token, user_data: { name, email } })
            }
        }
    } catch (error) {
        console.log(error)
        responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, global.internal_server_error);
    }
};


/***** register user *****/
module.exports.registerUser = async (req, res) => {
    try { }
    catch (error) {
        console.log(error)
        responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, global.internal_server_error);
    }
};