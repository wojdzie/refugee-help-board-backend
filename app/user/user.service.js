const User = require('./user');
const _ = require('lodash');

exports.authenticate = async ({ username, password }) => {
    const user = await User.findOne({login: username, password: password}, {password: false});
    if (user) 
        return user;
}

exports.findUserById = (id) => {
    return User.findById(id);
}

exports.findUsers = () => {
    return User.find();
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
