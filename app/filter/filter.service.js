const Notice = require('../notice/notice');

module.exports = { getFiltered, getPersonal, getAll }

async function getFiltered({ type, tags = [] }) {
    return Notice.find({type, tags: {$in: tags}})
}

async function getPersonal(user) {
    return Notice.find({author: user._id});
}

async function getAll() {
    return Notice.find();
}

