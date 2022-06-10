const Notice = require('../notice/notice');

module.exports = { getFiltered, getPersonal, getAll }

async function getFiltered({ type, tags = [] }, include_closed = false) {
    return Notice.find({type, tags: {$in: tags}, closed: include_closed})
}

async function getPersonal(user) {
    return Notice.find({author: user.login});
}

async function getAll() {
    return Notice.find();
}

