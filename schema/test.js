const mongoose = require('mongoose');
const testSchema = new mongoose.Schema({
    Name: String,
    Phone: String
}, {versionKey: false, timestamps: true} );
module.exports = mongoose.model('Test', testSchema, 'Test');
