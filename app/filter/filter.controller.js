const express = require('express');
const router = express.Router();
const filterService = require('./filter.service');

router.get('/filterTags', getFiltered);
router.get('/filterAll', getAll);


module.exports = router

function getFiltered(req, res, next) {
    if(req.query.tags === null) {
        req.query.tags = [];
    } else if (typeof req.query.tags === "string") {
        req.query.tags = [req.query.tags];
    }
    filterService.getFiltered(req.query)
        .then(item => res.json(item))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    filterService.getAll()
        .then(items => res.json(items))
        .catch(err => next(err));
}