const Notice = require('../notice/notice');

const items = [
    { id: 1, name: 'example', tags: ["tag1", "tag2"] },
    { id: 2, name: 'example1', tags: ["tag1", "tag2"] },
    { id: 3, name: 'example2', tags: ["tag3", "tag4"] }
]

module.exports = { getFiltered, getAll }

async function getFiltered(tag) {
    return items.filter(item => item.tags.includes(tag));
}

async function getAll() {
    //return items;
    return Notice.find();
}

