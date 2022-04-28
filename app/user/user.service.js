const User = require('./user');

exports.authenticate = (data) => {
    const users = User.find({login: data.login, password: data.password},
        (err, data) => {
            return data.map(x => x);
        });
    if (users.length === 0 || users.length > 1) {
        return "Login failed!";
    }

    return btoa(users[0].login + ":" + users[0].password);
}
exports.findUserById = (id) => {
    return User.findById(id);
}

exports.findUsers = () => {
    return User.find();
}

exports.createUser = (data) => {
    const user = new User ({
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
