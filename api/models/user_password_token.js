var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    token: { type: String },
    email: { type: String, index: true },
}, { timestamps: true });



module.exports = mongoose.model('user_password_token', Schema);