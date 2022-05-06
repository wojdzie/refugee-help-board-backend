const _ = require('lodash');
const Notice = require('./notice');

async function get(filter) {
    return Notice.find(filter);
}

async function search(text) {
    return Notice.find(
            { $text: { $search: text}}, 
            { score: { $meta: "textScore" }}
        ).sort(
            { score: { $meta: "textScore" }}
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
        description: data.description
    });

    return notice.save(notice);
}

function remove(notice_id) {
    return Notice.findByIdAndRemove(notice_id, { useFindAndModify: false });
}

function updateNotice(notice_id, data){
    return Notice.findByIdAndUpdate(notice_id, data, { useFindAndModify: false });
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
    return _.pick(data, ["type", "description"]);
}

module.exports = { get, add, search, remove, updateNotice }