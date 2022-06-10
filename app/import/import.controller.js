const express = require('express');
const router = express.Router();
const noticeService = require('../notice/notice.service');
const importService = require('./import.service');
const fs = require('fs');
const csvParser = require('csv-parser');
const xlsx = require('xlsx');

router.post("/csv", importCSV);
router.post("/xls", importXLS);
router.post("/json", importJSON);

module.exports = router;

async function importCSV(req, res) {
    let fileName = await importService.importFile(req, res, "csv");
    let notices = [];
    await new Promise((resolve, reject) => {
        fs.createReadStream(fileName).pipe(csvParser())
            .on("data", (data) => notices.push(data))
            .on("end", () => resolve());
    });
    await noticeService.addAll(notices, req.user);
    return res.send({ message: 'CSV file imported'});
}

async function importXLS(req, res) {
    let fileName = await importService.importFile(req, res, "xls");
    const workbook = xlsx.readFile(fileName);
    const sheet_name_list = workbook.SheetNames;
    const notices = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    await noticeService.addAll(notices, req.user);
    return res.send({ message: 'XLS file imported'});
}

async function importJSON(req, res) {
    let fileName = await importService.importFile(req, res, "json");
    let rawData = fs.readFileSync(fileName);
    let notices = JSON.parse(rawData);
    await noticeService.addAll(notices, req.user);
    return res.send({ message: 'JSON file imported'});
}

