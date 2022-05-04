const User = require('./user');

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
