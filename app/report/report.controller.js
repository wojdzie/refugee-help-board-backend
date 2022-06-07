const express = require('express');
const router = express.Router();
const reportService = require('./report.service');
const _ = require('lodash');
const moment = require('moment');

router.get('/overview', overview);
router.get('/periodic', periodic);

module.exports = router;

function overview(req, res, next) {
    reportService.overview()
        .then(result => res.send(result))
        .catch(err => next(err));
}

function periodic(req, res, next) {
	if (!_.has(req.body, "from") || !_.has(req.body, "to"))
		return res.status(400).send({ message: "Start and end dates are expected. Provide 'from' and 'to' fields" });
	let from = moment(req.body.from, moment.ISO_8601);
	let to = moment(req.body.to, moment.ISO_8601);
	if (!from.isValid() || !to.isValid())
		return res.status(400).send({message: "Provided dates are not valid. Expected format is ISO 8601"});
    reportService.periodic(from.toDate(), to.toDate())
        .then(result => res.send(result))
        .catch(err => next(err));
}