const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Notice = new Schema({
    author: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
    closed: { type: Boolean, default: false },
    closedAt: { type: Date }
});
Notice.index({ description: "text" });
Notice.set("timestamps", true);

module.exports = mongoose.model('Notice', Notice);