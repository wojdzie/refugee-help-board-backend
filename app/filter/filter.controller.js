const express = require('express');
const router = express.Router();
const filterService = require('./filter.service');

router.get('/filterTags', getFiltered);
router.get('/filterAll', getAll);


module.exports = router

function getFiltered(req, res, next) {
    filterService.getFiltered(req.query.tag)
        .then(item => item ? res.json(item) : res.status(204).end())
        .catch(err => next(err));
}

function getAll(req, res, next) {
    filterService.getAll()
        .then(items => res.json(items))
        .catch(err => next(err));
}