const Notice = require('../notice/notice');

module.exports = { getFiltered, getAll }

async function getFiltered({ type, tags = [] }) {
    return Notice.find({type, tags: {$in: tags}})//.find(item => item.tags.some(o => tags.includes(o)))
}

async function getAll() {
    return Notice.find();
}

