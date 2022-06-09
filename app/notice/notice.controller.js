const express = require('express');
const router = express.Router();
const noticeService = require('./notice.service');
const _ = require('lodash');
const notice = require('./notice');

router.post('/', add);
router.get('/', get);
router.get('/search', search);
router.delete('/:id', remove);
router.patch('/:id', update);
router.patch('/close/:id', close);

module.exports = router;

function get(req, res, next) {
    noticeService.get({}, _.has(req.query, "stale"), _.has(req.query, "closed"))
        .then(notices => res.send(notices))
        .catch(err => next(err));
}

function search(req, res, next) {
    const text = _.get(req, "query.q");
    if (typeof text !== "string" || text.length === 0)
        return res.status(400).send({message: "Search query is required to perform a search. It is expected in the query parameter 'q'."})

    noticeService.search(text)
        .then(notices => res.send(notices))
        .catch(err => next(err));
}

function add(req, res, next) {
    noticeService.add(req.body, req.user)
        .then(notice => res.send(notice))
        .catch(err => {
            if (_.get(err, "type") === "invalid-input")
                return res.status(400).json({ 
                    message: err.message 
                });
            next(err);
        });
}

function remove(req, res, next) {
    const noticeID = req.params.id;
    noticeService.remove(noticeID)
        .then(data => res.send({ message: `Notice with id = ${noticeID} was deleted successfully` }))
        .catch(err => res.status(500).send({ message: `Error deleting Notice with id = ${noticeID}` }));
}

async function update(req, res) {
    const notice = await noticeService.getById(req.params.id);
    if (!notice)
        return res.status(400).send({ message: `Notice with id = ${req.params.id} was not found` });
    if (notice.author != req.user._id)
        return res.status(401).send({ message: `You can only edit your own notices` });

    if (!req.body)
        return res.status(400).send({ message: "Content can not be empty!" });
    if (_.has(req.body, "type"))
        return res.status(400).send({ message:'type can not be edited' })
    if (_.has(req.body, "closed") || _.has(req.body, "closedAt"))
        return res.status(400).send({ message:'closed or closedAt can not be edited' })
    
    noticeService.update(notice._id, req.body)
        .then(data => res.send({ message: `Notice with id = ${req.params.id} was updated successfully`}))
        .catch(err => res.status(500).send({ message: `Error updating Notice with id = ${req.params.id}` }));
}

async function close(req, res, next) {
    const notice = (await noticeService.get({ _id: req.params.id}, true, true))[0];
    if (!notice)
        return res.status(400).send({ message: `Notice with id = ${req.params.id} was not found` });
    if (notice.author != req.user._id)
        return res.status(401).send({ message: `You can only close your own notices` });

    if (notice.closed)
        return res.status(400).send({ message: `Notice with id = ${req.params.id} is already closed` });

    noticeService.close(notice._id)
        .then(data => res.send({ message: `Notice with id = ${req.params.id} was closed successfully` }))
        .catch(err => res.status(500).send({ message: `Error closing Notice with id = ${req.params.id}` }));
}
