const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema ({
    login: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    firstName: { type: String },
    lastName: { type: String }
});
User.index({
    lastName: "text",
    firstName: "text",
    email: "text"
});

module.exports = mongoose.model('User', User);