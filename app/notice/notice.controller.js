const express = require('express');
const router = express.Router();
const noticeService = require('./notice.service');
const _ = require('lodash');
const notice = require('./notice');
const { update } = require('lodash');

router.post('/', add);
router.get('/', get);
router.get('/search', search);
router.delete('/:id', remove);
router.patch('/', update)

module.exports = router;

function get(req, res, next) {
    let filter = req.body;
    if (!req.body) {
        filter = {};
    }
    noticeService.get(filter)
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
    notice_id = req.params.id;
    noticeService.remove(notice_id)
    .then(notice => res.send(notice))
    .catch(err => {
        if (_.get(err, "type") === "invalid-input")
                return res.status(400).json({ 
                    message: err.message 
                });
            next(err);
        });
}

function update(res, req, next) {
    noticeService.update(req.body, req.user)
    .then(notice => res.send(notice))
    .catch(err => {
        if (_.get(err, "type") === "invalid-input")
                return res.status(400).json({ 
                    message: err.message 
                });
            next(err);
        });
}