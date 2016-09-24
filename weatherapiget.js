//restClient
var Client = require('node-rest-client').Client;
var client = new Client();
//
var calculator = require('./calcpremium.js');
//async
var async = require('async');
module.exports = {
    getInfo: function (req,res) {
        //APIのURL
        var WEATHER_BASE_URL = 'http://api.openweathermap.org/data/2.5/forecast?q=';
        var APPID = 'fe14e1cf4977b098525f9356840ab06a';
        var url;
        //天候の総得点
        var totalscore = 0;
        //保険料算出用の天候平均値
        var averagescore = 0;
        //保険料
        var premium = 0;
        //返却用天気の配列（毎6時ごと）
        var resweatherArray = [];
        //OpenWeatherAPI用
        var mountainCode;
        //TODO req parameterからとる
        var mountainId = '1';
        if (mountainId == "1") {    //燕岳
            mountainCode = 'Agematsu';
        } else if (mountainId == "2") { //槍ヶ岳
            mountainCode = 'Hitoegane';
        } else {    //とりあえず東京
            mountainCode = 'Tokyo';
        }
        //TODO OpenWeatherAPIを呼び出す
        url = WEATHER_BASE_URL + mountainCode + ',jp&APPID=' + APPID;
        console.log(url);
        var ret = [];
        async.waterfall([
            function(callback) {
                //お天気APIを呼び出す
                client.post(url, function(data, response) {
                    //javascriptに変換
                    var obj = JSON.parse(JSON.stringify(data.list));
                    //            console.log('hogehogehogehoeg');
                    console.log(obj.length);
                    //            console.log(obj);
                    console.log(obj[0]);

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
                        if (weatherCode == "01" || weatherCode == "02") {   //晴れ系
                            tmpValue = 1;
                        } else if (weatherCode == "02" || weatherCode == "04") {    //曇り系
                            tmpValue = 1.5;
                        } else if (weatherCode == "09" || weatherCode == "10") {    //雨系
                            tmpValue = 3;
                        } else if (weatherCode == "11" || weatherCode == "13") {    //雷、雪
                            tmpValue = 10;
                        } else if (weatherCode == "50") {   //霧
                            tmpValue = 5;
                        } else {
                            tmpValue = 1;
                        }
                        //合計値を出す
                        totalscore = totalscore + tmpValue;
                        //返却用の天気(年月日と天気コード)
                        if (dt_txt.substring(11,13) == "06") {
                            var resweather = new Object();
                            resweather.date = dt_txt.substring(0,10);
                            resweather.weatherCode = weatherCode;
                            resweatherArray.push(resweather);
                        }

                    }
                    averagescore = totalscore / obj.length;


                    console.log(resweatherArray);
                    console.log(totalscore);
                    console.log(averagescore);
                    callback(null,obj);
                })},
            function(arg0, callback) {
                premium = averagescore * calculator.calcBasePremium(50, '2016-09-24', '2016-09-25', '1');
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
                res.json(JSON.parse(ret));
                callback(null,'ok');
            }
        ],function(err, result) {
            if(err) throw err;
            //        res.json(JSON.parse(ret));
            console.log('series ok');
        });
        //    console.log(ret.length);
        //    res.json(JSON.stringify(ret));
    },


};
