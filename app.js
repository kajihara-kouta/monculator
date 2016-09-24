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

//body-parser
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

app.get('/calcPremium', function(req,res) {
    //年齢
    var age = req.body.age;
    //登山開始日
    var startYmd = req.body.startYmd;
    //下山日
    var endYmd = req.body.endYmd;
    //日数計算
    var period = Math.floor((new Date(endYmd).getTime() - new Date(startYmd).getTime())/(1000 * 60 * 60 * 24));
    if (period <= 0) {  //負の数を考慮して
        period = 1;
    }
    //登山対象
    var mountainId = req.body.mountainId;
    //体力度、難易度
    var physicalLevel;
    var difficultLevel;
    if (mountainId == "1") {    //燕岳
        physicalLevel = 4;
        difficultLevel = 2; //B
    } else if (mountainId == "2") {  //槍ヶ岳
        physicalLevel = 8;
        difficultLevel = 3; //C
    } else {    //その他の山を考慮して(default値)
        physicalLevel = 5;
        difficultLevel = 2;
    }
    //日額基準保険料
    var basePremiumPerDay = 500;
    //基準値
    var baseline = 10;
    //基準年齢
    var baseAge = 30;
    //保険料
    var premium = basePremiumPerDay * (physicalLevel * difficultLevel)* (age / baseAge) * period / baseline;
    res.send({totalPremium: premium});
});

// get the app environment from Cloud Foundry
//var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(8080);
