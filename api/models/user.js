var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var config = require('../config/config');

var UserSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Name is required!"] },
    email: { type: String, lowercase: true, unique: true, required: [true, "Email is required!"], match: [/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/, 'Email is invalid'], index: true },
    provider_type: { type: String, enum: ['EMAIL', 'SAWO'], default: 'EMAIL' },
    provider_id: { type: String, default: null },
    mobile: { type: String },
    hash: { type: String },
    salt: { type: String },
    status: { type: Boolean, default: true },
}, { timestamps: true });

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

UserSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.generateJWT = function () {
    return jwt.sign({ _id: this._id }, config.secretKey);
};

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The book title
 *         author:
 *           type: string
 *           description: The book author
 *       example:
 *         id: d5fE_asz
 *         title: The New Turing Omnibus
 *         author: Alexander K. Dewdney
*/
module.exports = mongoose.model('user', UserSchema);