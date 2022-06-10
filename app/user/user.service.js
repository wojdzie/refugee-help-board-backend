const User = require('./user');
const _ = require('lodash');

exports.authenticate = async ({ login, password }) => {
    const user = await User.findOne({ login: login, password: password });
    if (user)
        return user;
}

exports.login = async ({ login, password }) => {
    const user = await User.findOne({ login: login, password: password });
    if (user) {
        return {
            "token": "Basic " + btoa(user.login + ":" + user.password)
        };
    }
}

exports.findUserById = (id) => {
    return User.findById(id);
}

exports.findUsers = (filter) => {
    //omitting password in the filter as it's a potential vulnerability
    filter = _.omit(filter, ["password"]);
    return User.find(filter, {password: false});
}

exports.searchUsers = (text) => {
    return User.find(
            { $text: { $search: text}}, 
            { score: { $meta: "textScore" }}
        ).sort(
            { closed: 1, score: { $meta: "textScore" }, updatedAt: -1}
        );
}

exports.createUser = async (data) => {
    if (!_.has(data, "login") || 
        !_.has(data, "password"))
        throw {
            type: "incomplete-data"
        }

    let user = await User.findOne({login: data.login});
    if (user)
        throw {
            type: "login-exists"
        }

    user = new User ({
        login: data.login,
        password: data.password,
        email: data.email,
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName
    });
    return user.save(user);
}

exports.updateUser = (id, data) => {
    return User.findByIdAndUpdate(id, data, { useFindAndModify: false });
}

exports.deleteUser = (id) => {
    return User.findByIdAndRemove(id, { useFindAndModify: false });
}
