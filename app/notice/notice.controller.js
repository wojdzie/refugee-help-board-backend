const express = require('express');
const router = express.Router();
const noticeService = require('./notice.service');
const _ = require('lodash');

router.post('/add', add);
router.get('/get', get);

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
