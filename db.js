const mongoose = require('mongoose');

const mongoDB = 'mongodb://127.0.0.1/refugee-help-board';
mongoose.connect(mongoDB, {useNewUrlParse: true, useUnifiedTopology: true});

mongoose.connection.on('error', (error) => console.error.bind(console, 'MongoDB connection error: ', error));