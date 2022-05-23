const _ = require('lodash');
const moment = require("moment");
const Notice = require('./notice');

async function get(filter, include_stale = false, include_closed = false) {
    if (!include_closed)
        filter.closed = false;

    if (!include_stale)
        filter.updatedAt = {
            "$gte": moment().subtract(2, 'months').toDate()
        }
        
    return await Notice.find(filter);
}

async function search(text) {
    return Notice.find(
            { $text: { $search: text}}, 
            { score: { $meta: "textScore" }}
        ).sort(
            { closed: 1, score: { $meta: "textScore" }, updatedAt: -1}
        );
}

async function add(data, user) {
    try {
        data = validateData(data);
    } catch (err) {
        throw {
            type: "invalid-input",
            message: err.message
        }
    }

    notice = new Notice({
        author: user._id,
        type: data.type,
        description: data.description,
        tags: data.tags
    });

    return notice.save(notice);
}

function getNotice(user, element) {
    return new Notice({
        author: user._id,
        type: element.type,
        description: element.description,
        tags: element.tags
    });
}

async function addAll(data, user) {
    let notices = [];
    try {
        for (let element of data) {
            let notice = getNotice(user, element);
            notices.push(notice);
        }
    } catch (err) {
        throw {
            type: "invalid-input",
            message: err.message
        }
    }
    return Notice.insertMany(notices);
}

function remove(notice_id) {
    return Notice.findByIdAndRemove(notice_id, { useFindAndModify: false });
}

function updateNotice(notice_id, data){
    return Notice.findByIdAndUpdate(notice_id, data, { useFindAndModify: false });
}

function close(notice_id) {
    return Notice.findByIdAndUpdate(notice_id, { closed: true }, { useFindAndModify: false });
}

function validateData(data) {
    if (!_.isPlainObject(data))
        throw {
            message: "Unsupported format. Expected a json"
        }
    if (["type", "description"]
        .map(field => _.has(data, field))
        .some(res => res === false))
        throw {
            message: "Data is incomplete. Provided object does not have all necessary fields"
        }
    if (typeof data.type !== "string" || !["request", "offer"].includes(data.type))
        throw {
            message: "Unsupported notice type. Available types are: 'request' - for requesting aid, 'offer' - for offering aid"
        }
    if (typeof data.description !== "string" || data.description.length === 0)
        throw {
            message: "Description is expected to be a string and must not be empty"
        }
    return _.pick(data, ["type", "description", "tags"]);
}

module.exports = { get, add, addAll, search, remove, updateNotice, close }