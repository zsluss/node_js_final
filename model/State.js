const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stateSchema = new Schema({
    state: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    funfacts: [{
        type: String
    }]
});

module.exports = mongoose.model('State', stateSchema);