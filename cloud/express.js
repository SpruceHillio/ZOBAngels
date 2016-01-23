/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
var express = require('express');
var app = express();

// Global app configuration section
app.set('views', 'cloud/views');
app.set('view engine', 'ejs');
app.use(express.bodyParser());

// Render index for all request paths
app.get('/*', function (req, res) {
    res.render('index');
});
app.post('/*', function (req, res) {
    res.render('index');
});

// Attach the Express app to Cloud Code.
app.listen();