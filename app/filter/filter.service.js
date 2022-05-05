const Notice = require('../notice/notice');

module.exports = { getFiltered, getAll }

async function getFiltered(tag) {
    return Notice.filter(item => item.tags.some(o => tag.includes(o)))
}

async function getAll() {
    return Notice.find();
}

