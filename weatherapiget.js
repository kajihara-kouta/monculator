//restClient
var Client = require('node-rest-client').Client;
var client = new Client();
//
var calculator = require('./calcpremium.js');
//async
var async = require('async');
//common.js
var common = require('./common.js');
module.exports = {
    getInfo: function (req,res) {
        //APIのURL
        var WEATHER_BASE_URL = 'http://api.openweathermap.org/data/2.5/forecast?q=';
        var APPID = 'fe14e1cf4977b098525f9356840ab06a';
        //天候の総得点
        var totalscore = 0;
        //保険料算出用の天候平均値
        var averagescore = 0;
        //保険料
        var premium = 0;
        //返却用天気の配列（毎6時ごと）
        var resweatherArray = [];
        //TODO req parameterからとる
        var mountainId = '1';//req.body.mountainId;
        //OpenWeatherAPI用
        var mountainCode = common.getMountainCd(mountainId);
        var url = WEATHER_BASE_URL + mountainCode + ',jp&APPID=' + APPID;
        //結果
        var ret = [];
        //開始日
        var startYmd = '2016-09-24';//req.body.startYmd;
        //下山日
        var endYmd = '2016-09-25';//req.body.endYmd;
        //年齢
        var age = '50';//req.body.age;
        async.waterfall([
            function(callback) {
                //お天気APIを呼び出す
                client.post(url, function(data, response) {
                    //javascriptに変換
                    var obj = JSON.parse(JSON.stringify(data.list));
                    averagescore = common.getAverageScore(startYmd, endYmd, obj);
                    for (i=0; i < obj.length; i++) {

                        //天気を数値化
                        var tmpValue = 0;
                        var object = obj[i];
                        //yyyy-mm-dd hh:mm:ss(hhは3の倍数)
                        var dt_txt = object.dt_txt;
                        var tmpweather = object.weather;
                        //天気を取る
                        var tmpMain = tmpweather[0].main;
                        var tmpIcon = tmpweather[0].icon;
                        //天気コード
                        var weatherCode = tmpIcon.substring(0,2);
                        if (dt_txt.substring(11,13) == "06") {
                            var resweather = new Object();
                            resweather.date = dt_txt.substring(0,10);
                            resweather.weatherCode = weatherCode;
                            resweatherArray.push(resweather);
                        }
                    }
                    console.log(resweatherArray);
                    console.log(totalscore);
                    console.log(averagescore);
                    callback(null,obj);
                })},
            function(arg0, callback) {
                premium = Math.round(averagescore * calculator.calcBasePremium(age, startYmd, endYmd, mountainId));
                console.log(premium);
                callback(null, arg0);
            },
            function(arg1, callback) {
                for (i = 0; i < arg1.length; i ++) {
                    ret.push(arg1[i]);
                }
                console.log(ret.length);
                callback(null,ret);
            },
            function(arg2, callback) {
                console.log('response');
//                res.json(JSON.parse(JSON.stringify(ret)));
                res.json(JSON.parse(JSON.stringify(resweatherArray)));
                callback(null,'ok');
            }
        ],function(err, result) {
            if(err) throw err;
            console.log('series ok');
        });
    },
    getPremium: function(req,res) {
        //APIのURL
        var WEATHER_BASE_URL = 'http://api.openweathermap.org/data/2.5/forecast?q=';
        var APPID = 'fe14e1cf4977b098525f9356840ab06a';
        //天候の総得点
        var totalscore = 0;
        //保険料算出用の天候平均値
        var averagescore = 0;
        //保険料
        var premium = 0;
        //返却用天気の配列（毎6時ごと）
        var resweatherArray = [];
        //TODO req parameterからとる
        var mountainId = '1';//req.body.mountainId;
        //OpenWeatherAPI用
        var mountainCode = common.getMountainCd(mountainId);
        var url = WEATHER_BASE_URL + mountainCode + ',jp&APPID=' + APPID;
        //結果
        var ret = [];
        //開始日
        var startYmd = '2016-09-24';//req.body.startYmd;
        //下山日
        var endYmd = '2016-09-25';//req.body.endYmd;
        //年齢
        var age = '50';//req.body.age;
        async.waterfall([
            function(callback) {
                //お天気APIを呼び出す
                client.post(url, function(data, response) {
                    //javascriptに変換
                    var obj = JSON.parse(JSON.stringify(data.list));
                    averagescore = common.getAverageScore(startYmd, endYmd, obj);
                    for (i=0; i < obj.length; i++) {

                        //天気を数値化
                        var tmpValue = 0;
                        var object = obj[i];
                        //yyyy-mm-dd hh:mm:ss(hhは3の倍数)
                        var dt_txt = object.dt_txt;
                        var tmpweather = object.weather;
                        //天気を取る
                        var tmpMain = tmpweather[0].main;
                        var tmpIcon = tmpweather[0].icon;
                        //天気コード
                        var weatherCode = tmpIcon.substring(0,2);
                        if (dt_txt.substring(11,13) == "06") {
                            var resweather = new Object();
                            resweather.date = dt_txt.substring(0,10);
                            resweather.weatherCode = weatherCode;
                            resweatherArray.push(resweather);
                        }
                    }
                    console.log(resweatherArray);
                    console.log(totalscore);
                    console.log(averagescore);
                    callback(null,obj);
                })},
            function(arg0, callback) {
                premium = Math.round(averagescore * calculator.calcBasePremium(age, startYmd, endYmd, mountainId));
                console.log(premium);
                callback(null, arg0);
            },
            function(arg1, callback) {
                for (i = 0; i < arg1.length; i ++) {
                    ret.push(arg1[i]);
                }
                console.log(ret.length);
                callback(null,ret);
            },
            function(arg2, callback) {
                console.log('response');
                //                res.json(JSON.parse(JSON.stringify(ret)));
                res.json({premium:premium});
                callback(null,'ok');
            }
        ],function(err, result) {
            if(err) throw err;
            console.log('series ok');
        });
    },
};
