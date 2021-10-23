const config = require('../../config/config');
const httpStatus = require("http-status-codes");
const Admin = require('../../models/admin');
const AdminToken = require('../../models/admin_token');
const AdminPWDToken = require('../../models/admin_password_token');
const Role = require('../../models/role');
const global = require('../../resources/lang/en/global');
const helper = require('../../helper/helper');
const ejs = require('ejs');
const path = require('path');
const responseManagement = require('../../lib/responseManagement');

/****** Login ****/
module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Admin.findOne({ email });
        if (user) {
            if (user.validPassword(password)) {
                if (user.status) {
                    const token = await user.generateJWT();
                    var req_ip = req.connection.remoteAddress.split(":")[3] || '';
                    let atoken = new AdminToken({ admin_id: user.id, token, req_ip, user_agent: req.headers['user-agent'] });
                    const result = await atoken.save();
                    const user_data = {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        mobile: user.mobile
                    };
                    responseManagement.sendResponse(res, httpStatus.OK, global.logged_in_successful, { "token": token, user_data })

                } else {
                    responseManagement.sendResponse(res, httpStatus.UNAUTHORIZED, global.user_is_inactive);
                }
            } else {
                responseManagement.sendResponse(res, httpStatus.BAD_REQUEST, global.invalid_credentials);
            }
        } else {
            responseManagement.sendResponse(res, httpStatus.BAD_REQUEST, global.invalid_credentials);
        }
    } catch (error) {
        console.log(error)
        responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, global.internal_server_error);
    }
};


/****** Forgot Password ****/
module.exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await Admin.findOne({ email });
        if (user) {
            const token = require('crypto').randomBytes(32).toString('hex');
            const aptoken = new AdminPWDToken({ admin_id: user._id, token, email: user.email });
            const result = await aptoken.save();
            const password_reset_link = config.adminResetPasswordLink + token;
            if (result) {
                const html = await ejs.renderFile(path.join(__dirname, '../helper/email_templates/password_reset.html'), { password_reset_link });
                const to = [user.email];
                const subject = 'Buildo - Reset your account password';
                const emailResult = await helper.sendEmail(to, subject, html);
                if (emailResult) {
                    responseManagement.sendResponse(res, httpStatus.OK, global.password_reset_link)
                } else {
                    responseManagement.sendResponse(res, httpStatus.BAD_REQUEST, global.something_went_wrong)
                }
            } else {
                responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, global.internal_server_error);
            }
        } else {
            responseManagement.sendResponse(res, httpStatus.UNAUTHORIZED, global.invalid_email)
        }
    } catch (error) {
        console.log(error)
        responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, global.internal_server_error);
    }
};


/****** Reset Password ****/
module.exports.resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        const ptoken = await AdminPWDToken.findOne({ token });
        if (ptoken) {
            const user = await Admin.findOne({ _id: ptoken.admin_id });
            if (user) {
                user.setPassword(password);
                const result = await Admin.updateOne({ _id: user._id }, user);
                if (result) {
                    await AdminPWDToken.deleteOne({ _id: ptoken._id });
                    responseManagement.sendResponse(res, httpStatus.OK, global.password_reset_successfully)
                } else {
                    responseManagement.sendResponse(res, httpStatus.BAD_REQUEST, global.something_went_wrong)
                }
            }
            else {
                responseManagement.sendResponse(res, httpStatus.BAD_REQUEST, global.invalid_admin_token)
            }
        } else {
            responseManagement.sendResponse(res, httpStatus.BAD_REQUEST, global.invalid_admin_token)
        }
    } catch (error) {
        console.log(error)
        responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, global.internal_server_error);
    }
};
/****** Logout ****/
module.exports.logout = async (req, res) => {
    try {
        let result = await AdminToken.deleteOne({ admin_id: req.user._id, token: req.token });
        if (result) {
            responseManagement.sendResponse(res, httpStatus.OK, global.logged_out_successful);
        }
        else {
            responseManagement.sendResponse(res, httpStatus.UNAUTHORIZED, global.internal_server_error);
        }
    } catch (error) {
        console.log(error)
        responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, global.internal_server_error);
    }
};
/****** Get Roles ****/
module.exports.getRoles = async (req, res) => {
    try {
        const { start, length, columns, order, search, draw } = req.body;
        const sortColumn = columns[order[0].column].data;
        const sortOrder = order[0].dir;
        const searchValue = search.value;
        var search_query = [];
        for (var i = 0; i < columns.length; i++) {
            if (columns[i].searchable) {
                var key = columns[i]['name']
                search_query.push({
                    [key]: { '$regex': searchValue, '$options': 'i' }
                });
            }
        }
        var sort_q = {
            [sortColumn]: sortOrder
        }
        var query1;
        if (searchValue) {
            query1 = { $or: search_query };
        } else {
            query1 = {};
        }
        const roles = await Role.find({ $and: [query1] }, {}, { sort: sort_q, skip: start, limit: length });
        const total = await Role.countDocuments({});
        const stotal = await Role.countDocuments({ $and: [query1] });
        res.send({ statusCode: httpStatus.OK, roles: roles, draw: draw, recordsTotal: total, recordsFiltered: stotal })
    } catch (error) {
        console.log(error)
        responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, global.internal_server_error);
    }
};


/****** Add Role ****/
module.exports.addRole = async (req, res) => {
    try {
        const { name, modules } = req.body;
        const role = new Role({ name, permissions: modules });
        const result = await role.save();
        if (result) {
            responseManagement.sendResponse(res, httpStatus.OK, global.role_add_successfully);
        } else {
            responseManagement.sendResponse(res, httpStatus.UNAUTHORIZED, global.internal_server_error);
        }
    } catch (error) {
        console.log(error)
        responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, global.internal_server_error);
    }
};



/****** Delete Role ****/
module.exports.deleteRole = async (req, res) => {
    try {
        const role = await Role.findOne({ _id: req.query.id });
        if (role) {
            const result = await Role.deleteOne({ _id: req.query.id });
            responseManagement.sendResponse(res, httpStatus.OK, global.deleted_role_successfully);
        } else {
            responseManagement.sendResponse(res, httpStatus.BAD_REQUEST, global.invalid_user_id)
        }
    } catch (error) {
        responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, global.internal_server_error);
    }
};
/****** Edit Role ****/
module.exports.editRole = async (req, res) => {
    try {
        const role = await Role.findOne({ _id: req.query.id });
        if (role) {
            responseManagement.sendResponse(res, httpStatus.OK, '', { role });
        } else {
            responseManagement.sendResponse(res, httpStatus.BAD_REQUEST, global.invalid_user_id);
        }
    } catch (error) {
        responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, global.internal_server_error);
    }
};

/****** Roles ****/

module.exports.roles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.send({ statusCode: httpStatus.OK, roles: roles })
    } catch (error) {
        console.log(error)
        responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, global.internal_server_error);
    }
};

/****** Update Role ****/
module.exports.updateRole = async (req, res) => {
    try {
        const { id, name, modules } = req.body;
        const result = await Role.updateOne({ _id: id }, { name, permissions: modules });
        if (result) {
            responseManagement.sendResponse(res, httpStatus.OK, global.role_update_successfully);
        } else {
            responseManagement.sendResponse(res, httpStatus.UNAUTHORIZED, global.internal_server_error);
        }
    } catch (error) {
        console.log(error)
        responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, global.internal_server_error);
    }
};



/****** Admins ****/
module.exports.admins = async (req, res) => {
    try {
        const { start, length, columns, order, search, draw } = req.body;
        const sortColumn = columns[order[0].column].data;
        const sortOrder = order[0].dir;
        const searchValue = search.value;
        var search_query = [];
        for (var i = 0; i < columns.length; i++) {
            if (columns[i].searchable) {
                var key = columns[i]['name']
                search_query.push({
                    [key]: { '$regex': searchValue, '$options': 'i' }
                });
            }
        }
        var sort_q = {
            [sortColumn]: sortOrder
        }
        var query1;
        if (searchValue) {
            query1 = { $or: search_query };
        } else {
            query1 = {};
        }
        const admins = await Admin.find({ $and: [{ role_id: { $ne: null } }, query1] }, {}, { sort: sort_q, skip: start, limit: length }).populate({ path: 'role_id', select: ['name'], model: 'role' });
        const total = await Admin.countDocuments({ role_id: { $ne: null } });
        const stotal = await Admin.countDocuments({ $and: [{ role_id: { $ne: null } }, query1] });
        res.send({ statusCode: httpStatus.OK, admins: admins, draw: draw, recordsTotal: total, recordsFiltered: stotal })
    } catch (error) {
        console.log(error)
        responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, global.internal_server_error);
    }
};


/****** Delete Admin ****/
module.exports.deleteAdmin = async (req, res) => {
    try {
        const user = await Admin.findOne({ _id: req.query.id });
        if (user) {
            const result = await Admin.deleteOne({ _id: req.query.id });
            responseManagement.sendResponse(res, httpStatus.OK, global.deleted_user_successfully);
        } else {
            responseManagement.sendResponse(res, httpStatus.BAD_REQUEST, global.invalid_user_id)
        }
    } catch (error) {
        responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, global.internal_server_error);
    }
};


/****** Admin Detail ****/
module.exports.editAdmin = async (req, res) => {
    try {
        const user = await Admin.findOne({ _id: req.query.id });
        if (user) {
            const admin = {
                id: user.id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role_id: user.role_id
            };
            responseManagement.sendResponse(res, httpStatus.OK, '', { admin });
        } else {
            responseManagement.sendResponse(res, httpStatus.BAD_REQUEST, global.invalid_user_id)
        }
    } catch (error) {
        responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, global.internal_server_error);
    }
};

/****** Create Admin ****/
module.exports.createAdmin = async (req, res) => {
    try {
        const { email, mobile } = req.body;
        const user = await Admin.findOne({ $or: [{ email }, { mobile }] });
        if (user) {
            responseManagement.sendResponse(res, httpStatus.BAD_REQUEST, global.email_or_mobile_already_exist);
        } else {
            const newuser = await Admin(req.body).save();
            const token = require('crypto').randomBytes(32).toString('hex');
            const data = { admin_id: newuser._id, token, email: email };
            await AdminPWDToken(data).save();
            const password_reset_link = config.adminResetPasswordLink + token;
            const html = await ejs.renderFile(path.join(__dirname, '../helper/email_templates/password_reset.html'), { password_reset_link });
            const to = [email];
            const subject = 'Salesmax - Set your account password';
            const emailResult = await helper.sendEmail(to, subject, html);
            responseManagement.sendResponse(res, httpStatus.OK, global.signup_success);
        }
    } catch (error) {
        console.log(error)
        responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, global.internal_server_error);
    }
};


/******Update Admin ****/
module.exports.updateAdmin = async (req, res) => {
    try {
        const user = await Admin.findOne({ _id: req.body.id });
        if (user) {
            const result = await Admin.updateOne({ _id: req.body.id }, req.body);
            responseManagement.sendResponse(res, httpStatus.OK, global.admin_update_successful);
        } else {
            responseManagement.sendResponse(res, httpStatus.UNAUTHORIZED, global.internal_server_error);
        }
    } catch (error) {
        console.log(error)
        responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, global.internal_server_error);
    }
};






