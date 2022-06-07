const express = require('express');
const router = express.Router();
const noticeService = require('./notice.service');
const _ = require('lodash');
const notice = require('./notice');
const { update, join} = require('lodash');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const xlsx = require('xlsx');

router.post('/', add);
router.get('/', get);
router.get('/search', search);
router.delete('/:id', remove);
router.patch('/:id', updateNotice);

router.post("/import/csv", importCSV);
router.post("/import/xls", importXLS);
router.post("/import/json", importJSON);

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

async function importCSV(req, res) {
    let fileName = await importFile(req, res, "csv");
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
    let fileName = await importFile(req, res, "xls");
    const workbook = xlsx.readFile(fileName);
    const sheet_name_list = workbook.SheetNames;
    const notices = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    await noticeService.addAll(notices, req.user);
    return res.send({ message: 'XLS file imported'});
}

async function importJSON(req, res) {
    let fileName = await importFile(req, res, "json");
    let rawData = fs.readFileSync(fileName);
    let notices = JSON.parse(rawData);
    await noticeService.addAll(notices, req.user);
    return res.send({ message: 'JSON file imported'});
}

const isFileValid = (requiredFileType, file) => {
    const type = file.originalFilename.split(".").pop();
    return type.localeCompare(requiredFileType, undefined, { sensitivity: 'accent' }) === 0;
};

async function importFile(req, res, fileType) {
    let form = new formidable.IncomingForm();
    const uploadFolder = path.join(__dirname, "/../../imports");
    return await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                console.log('Error parsing the files');
                reject(err);
                return res.status(400).send({message: 'Error parsing the files'})
            }
            const file = files.import;
            const isValid = isFileValid(fileType, file);
            const fileName = encodeURIComponent(file.originalFilename.replace(/\s/g, '_'));
            if (!isValid) {
                return res.status(400).send({message: 'The file type is not a valid type'});
            }

            if (!file.length) {
                fs.rename(file.filepath, path.join(uploadFolder, fileName), () => {
                    console.log('File renamed!');
                });
            }
            resolve(path.join(uploadFolder, fileName));
        });
    });
}