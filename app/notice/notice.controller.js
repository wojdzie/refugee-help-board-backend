const express = require('express');
const router = express.Router();
const noticeService = require('./notice.service');
const _ = require('lodash');

router.post('/', add);
router.get('/', get);
router.get('/search', search);
router.delete('/:id', remove);
router.patch('/:id', updateNotice);
router.patch('/close/:id', close);

module.exports = router;

function get(req, res, next) {
    let filter = req.body;
    if (!req.body) {
        filter = {};
    }
    noticeService.get(filter, _.has(req.query, "stale"), _.has(req.query, "closed"))
        .then(notices => res.send(notices))
        .catch(err => next(err));
}

function search(req, res, next) {
    const text = _.get(req, "body.text");
    if (typeof text !== "string" || text.length === 0)
        return res.status(400).send({message: "Text is required to perform a search. It is expected in a 'text' field of a request body."})

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

function updateNotice(req, res) {
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    if(req.body.type){
        return res.status(400).send({message:'Can only edit description'})
    }
    
    const noticeID = req.params.id;
    noticeService.updateNotice(noticeID, req.body)
        .then(data => res.send({ message: `Notice with id = ${noticeID} was updated successfully`}))
        .catch(err => res.status(500).send({ message: `Error updating Notice with id = ${noticeID}` }));
}

async function close(req, res, next) {
    const notice = (await noticeService.get({ _id: req.params.id}, true, true))[0];
    if (!notice)
        return res.status(400).send({ message: `Notice with id = ${req.params.id} was not found` });
    if (notice.author != req.user._id)
        return res.status(401).send({ message: `You can only close your own notices` });
    noticeService.close(notice._id)
        .then(data => res.send({ message: `Notice with id = ${req.params.id} was closed successfully` }))
        .catch(err => res.status(500).send({ message: `Error closing Notice with id = ${req.params.id}` }));
}
