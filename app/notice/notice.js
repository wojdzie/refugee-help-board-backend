const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Notice = new Schema ({
    author: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true},
});
Notice.index({description: "text"});

module.exports = mongoose.model('Notice', Notice);