const _ = require('lodash');
const moment = require("moment");
const noticeService = require('../notice/notice.service');
const Notice = require('../notice/notice');

async function overview() {
	return {
		total: (await noticeService.get({}, true, true)).length,
		requests: {
			total: (await noticeService.get({ type: "request" }, true, true)).length,
			active: (await noticeService.get({ type: "request" })).length
		},
		offers: {
			total: (await noticeService.get({ type: "offer" }, true, true)).length,
			active: (await noticeService.get({ type: "offer" })).length
		}
	}
}

async function periodic(start_date, end_date) {
	return {
		requests: {
			total: (await Notice.find({
					type: "request",
					createdAt: {
						"$gte": start_date,
						"$lte": end_date
					}
				})).length,
			closed: (await Notice.find({
					type: "request",
					createdAt: {
						"$gte": start_date,
						"$lte": end_date
					},
					closed: true,
					closedAt: {
						"$lte": end_date
					}
				})).length
		},
		offers: {
			total: (await Notice.find({
					type: "offer",
					createdAt: {
						"$gte": start_date,
						"$lte": end_date
					}
				})).length,
			closed: (await Notice.find({
					type: "offer",
					createdAt: {
						"$gte": start_date,
						"$lte": end_date
					},
					closed: true,
					closedAt: {
						"$lte": end_date
					}
				})).length
		}
	}
}

module.exports = { periodic, overview };
