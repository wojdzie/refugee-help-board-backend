const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const basicAuth = require('./auth/basic-auth');
const errorHandler = require('./error/error-handler');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

// Use basic HTTP authentication to secure the API
app.use(basicAuth);

// API routes
app.use('/user', require('./user/user.controller'));
app.use('/notice', require('./notice/notice.controller'));

// Global error handler
app.use(errorHandler);

// Start server
const port = 8080;
const server = app.listen(port, () => {
    console.log('Server listening on port ' + port);
});