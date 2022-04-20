const _ = require('lodash');

const notices = [{ 
    id: 1, 
    author: 'test',
    type: "request",
    description: "blah blah"
}, { 
    id: 2, 
    author: 'test',
    type: "offer",
    description: "sample text"
}];

//a very very temporary thing
function getFreeId() {
    let id = 0;
    while (!!_.find(notices, {
        id: id
    }))
        id++;
    return id;
}

async function get(filters = []) {
    if (!filters.length)
        return notices;

    //filters to be implemented later on
    return notices;
}

async function add(notice, user) {
    try {
        notice = validateNotice(notice);
    } catch (err) {
        throw {
            type: "invalid-input",
            message: err.message
        }
    }

    notice.id = getFreeId();
    notice.author = user.username;
    notices.push(notice);

    return notice.id;
}

function validateNotice(notice) {
    if (!_.isPlainObject(notice))
        throw {
            message: "Unsupported format. Expected a json"
        }
    if (["type", "description"]
        .map(field => _.has(notice, field))
        .some(res => res === false))
        throw {
            message: "Incomplete notice. Provided object does not have all necessary fields"
        }
    if (typeof notice.type !== "string" || !["request", "offer"].includes(notice.type))
        throw {
            message: "Unsupported type. Available types are: 'request' - for requesting aid, 'offer' - for offering aid"
        }
    if (typeof notice.description !== "string" || notice.description.length === 0)
        throw {
            message: "Description is expected to be a string and must not be empty"
        }
    return _.pick(notice, ["type", "description"]);
}

module.exports = { get, add }