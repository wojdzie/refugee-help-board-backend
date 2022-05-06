const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const basicAuth = require('./app/auth/basic-auth');
const errorHandler = require('./app/error/error-handler');

const db = require('./db');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors());
app.use(basicAuth);

app.use('/user', require('./app/user/user.controller'));
app.use('/notice', require('./app/notice/notice.controller'));
app.use('/filter', require('./app/filter/filter.controller'));

app.use(errorHandler);

const port = 8080;
app.listen(port, () => {
    console.log('Server listening on port ' + port);
});