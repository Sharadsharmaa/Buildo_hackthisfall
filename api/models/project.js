var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    name: { type: String },
    developer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'developer' },
    short_description: { type: String },
    long_description: { type: String },
    total_area: { type: String },
    total_price: { type: String },
    project_type: { type: String, enum: ['RESIDENTIAL', 'COMMERCIAL', 'RENTAL', 'PARTIAL SOLD'] },
    project_size_acres: { type: String },
    project_availability: { type: Number },
    project_price: [{ price: { type: String }, area: { type: String } }],
    floor_plan: { type: String },
    images: [{ type: String }],
    address: { type: String },
    city: { type: String },
    country: { type: String },
    location: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
        }
    },
    resourceUrl:{ type: String},
    status: { type: Boolean, default: true }


}, { timestamps: true, versionKey: false });



module.exports = mongoose.model('project', Schema);