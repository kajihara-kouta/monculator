/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
//var cfenv = require('cfenv');

//body-parser
var bodyParser = require('body-parser');
// create a new express server
var app = express();

//天気API
var weatherApi = require('./weatherapiget.js');

//body-parser
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

app.post('/getMountInfo', weatherApi.getInfo);

app.post('/getPremium', weatherApi.getPremium);

// get the app environment from Cloud Foundry
//var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(8080);
