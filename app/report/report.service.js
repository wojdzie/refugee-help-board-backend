const path = require("path");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../config.json")));

const _ = require('lodash');
const moment = require("moment");
const noticeService = require('../notice/notice.service');

async function overview() {
	const notices = await noticeService.get({}, true, true);
	const stale_period_ago = moment().subtract(config.notice.stale_period.value, config.notice.stale_period.unit).toDate();

	return {
		total: notices.length,
		requests: {
			total: notices.filter(notice => notice.type == "request").length,
			active: notices.filter(notice => 
				notice.type == "request" &&
				!notice.closed &&
				notice.updatedAt >= stale_period_ago
				).length
		},
		offers: {
			total: notices.filter(notice => notice.type == "offer").length,
			active: notices.filter(notice => 
				notice.type == "offer" &&
				!notice.closed &&
				notice.updatedAt >= stale_period_ago
				).length
		}
	}
}

async function periodic(start_date, end_date) {
	const notices = await noticeService.get({createdAt: {
		"$gte": start_date,
		"$lte": end_date
	}}, true, true);

	return {
		requests: {
			total: notices.filter(notice => notice.type == "request").length,
			closed: notices.filter(notice => 
				notice.type == "request" &&
				notice.closed &&
				notice.closedAt <= end_date
				).length,
		},
		offers: {
			total: notices.filter(notice => notice.type == "offer").length,
			closed: notices.filter(notice => 
				notice.type == "offer" &&
				notice.closed &&
				notice.closedAt <= end_date
				).length,
		}
	}
}

module.exports = { periodic, overview };
