//restClient
var Client = require('node-rest-client').Client;
var client = new Client();
//async
var async = require('async');
//util
var utils = require('../common/util.js');
var common = require('../common.js');

const WEATHER_BASE_URL = 'http://api.openweathermap.org/data/2.5/forecast?q=';
const APPID = 'fe14e1cf4977b098525f9356840ab06a';

//基準保険料
var basisPremium = utils.getPremiumParameterByKey('basispremium');
//基準保険期間
var basisInsPeriod = utils.getPremiumParameterByKey('basisinsperiod');
//基準年齢
var standardAge = utils.getPremiumParameterByKey('standardage');

module.exports = {
    //保険料計算
    calcPremium: function(fromdate, todate, age, mountainId) {
        return new Promise(function(resolve, reject) {
            var nowdatetime = new Date().getTime();
            console.log('nowdate is:', nowdatetime);
            if (new Date(fromdate).getTime() < nowdatetime || new Date(todate).getTime() < nowdatetime) {
                reject({message:"you can't specify the past day", premium:0});
                return;
            }
            //山の情報
            var mountinfo = utils.getMountainById(mountainId);
            //山のある都市名
            var cityName = mountinfo.cityName;
            var url = WEATHER_BASE_URL + cityName + ',jp&APPID=' + APPID;
            //難易度
            var difficulty = mountinfo.difficulty;
            //切り上げた値を日数とする
            var period = Math.ceil((new Date(todate).getTime() - new Date(fromdate).getTime())/(1000*60*60*24));
            //年齢によるレート
            var agerate = (age > 50)? age/50:1;
            //TODO 天気の情報
            //保険料
            var premium = basisPremium * (period/basisInsPeriod) * agerate * difficulty;
            async.waterfall([
                function(callback) {
                    client.post(url, function(data, response) {
                        //jsonに変換
                        var obj = JSON.parse(JSON.stringify(data.list));
                        console.log(obj);
                        callback(null, obj);

                    })
                }, function(arg0, callback) {
                    var averagescore = common.getAverageScore(fromdate, todate, arg0);
                    console.log('average score is:', averagescore);
                    var respremium = premium * averagescore;
                    callback(null, respremium);
                }
            ], function(err, arg0) {
                console.log(arg0);
                resolve(Math.floor(arg0));
            })
        });


    },
    calcAge: function(birthymd) {
        var age = Math.floor((new Date().getTime() - new Date(birthymd + ' 00:00:00').getTime())/(1000*60*60*24));
        return age;
    }
}
