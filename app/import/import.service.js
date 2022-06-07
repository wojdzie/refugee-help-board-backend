const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

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
                fs.rename(file.filepath, path.join(uploadFolder, fileName), () => {});
            }
            let filePath = path.join(uploadFolder, fileName);
            while (!fs.existsSync(filePath)) {
                // wait for file
            }
            resolve(filePath);
        });
    });
}

module.exports = { importFile }