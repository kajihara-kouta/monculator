var express = require('express');

//body-parser
var bodyParser = require('body-parser');
// create a new express server
var app = express();

//天気API
var weatherApi = require('./weatherapiget.js');

//ユーザ操作
var user = require('./routes/user.js');
//緊急連絡先
var emergencyContact = require('./routes/emergencyContact.js');
//登山計画
var plan = require('./routes/plan.js');
//保険料
var contract = require('./routes/contract.js');

//body-parser
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

//mailer
//var sendmail = require('./mailor.js');
//var intervals = setInterval(function() {
//    console.log('mail started');
//    sendmail.alertMail();
//}, 30000);
//setTimeout(function() {
//    console.log('mail end');
//    clearInterval(intervals);
//}, 4000000);

//csv読み込み
var csvReader = require('./csvreader.js');
//山情報取得
app.post('/getMountInfo', weatherApi.getInfo);
//保険料取得
app.post('/getPremium', weatherApi.getPremium);
//歩数情報取得
app.get('/readSteps', csvReader.readSteps);

app.use('/apis/users', user);

app.use('/apis/emergencyContact', emergencyContact);

app.use('/apis/plan', plan);

app.use('/apis/contract',contract);
// start server on the specified port and binding host
app.listen(9080);
