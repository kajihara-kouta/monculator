//restClient
var Client = require('node-rest-client').Client;
var client = new Client();
//async
var async = require('async');

module.exports = {
    getMountainCd: function(mountainId) {//山コード取得
        var mountainCode;
        if (mountainId == "1") {    //燕岳
            mountainCode = 'Agematsu';
        } else if (mountainId == "2") { //槍ヶ岳
            mountainCode = 'Hitoegane';
        } else {    //とりあえず東京
            mountainCode = 'Tokyo';
        }
        return mountainCode;
    },
    getWeatherInfo: function(mountainCode) {//山の天気情報取得
        /*APIのURL*/
        var WEATHER_BASE_URL = 'http://api.openweathermap.org/data/2.5/forecast?q=';
        /*APPID*/
        var APPID = 'fe14e1cf4977b098525f9356840ab06a';
        /*生成されるURL*/
        var url = WEATHER_BASE_URL + mountainCode + ',jp&APPID=' + APPID;
        //データ
        var obj;
        //同期化
        async.waterfall([
            function(callback) {
                //お天気APIを呼び出す
                client.post(url, function(data, response) {
                    console.log('post done...');
                    //javascriptに変換
                    obj = JSON.parse(JSON.stringify(data.list));
                    console.log(obj);
                });
                setTimeout(function() {
                    callback(null, obj);
                }, 1000);
            },function(arg1, callback) {
                setTimeout(function(){
//                    return arg1;
                    callback(null, 'ok');
                }, 100);
            }
        ], function(err, result) {
            if(err) throw err;
            console.log('series ok');
            return obj;
        });
    },
    getAverageScore: function(startYmd,endYmd, obj) {//山の天気の平均値取得
        //合計値
        var totalScore = 0;
        //開始日のミリ秒
        var stime = new Date(startYmd + ' 00:00:00').getTime();
        console.log(stime);
        //終了日のミリ秒
        var etime = new Date(endYmd + ' 23:59:59').getTime();
        console.log(etime);
        //該当件数
        var counter = 0;
        for (i = 0; i < obj.length; i++) {
            var object = obj[i];
            var tmpValue = 0;
            var dt_txt_mill = new Date(object.dt_txt).getTime();
            if (stime < dt_txt_mill && dt_txt_mill < etime) {
                counter = counter + 1;
                var weatherCode = object.weather[0].icon.substring(0,2);
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
                totalScore = totalScore + tmpValue;
            }
        }
        return totalScore / counter;
    },
    /* 天気の名称を返却 */
    getWeatherValue: function(weatherCode) {
        var ret;
        if (weatherCode == "01" || weatherCode == "02") {   //晴れ系
            ret = 'sunny';
        } else if (weatherCode == "02" || weatherCode == "04") {    //曇り系
            ret = 'cloudy';
        } else if (weatherCode == "09" || weatherCode == "10") {    //雨系
            ret = 'rainy';
        } else if (weatherCode == "11" || weatherCode == "13") {    //雷、雪
            ret = 'thunder';
        } else if (weatherCode == "50") {   //霧
            ret = 'fog';
        } else {
            ret = '';
        }
        return ret;
    }

}
