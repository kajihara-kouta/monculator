var CSV = require('csv-lite');
var fs = require('fs');
var Converter = require('csvtojson').Converter;
var converter = new Converter({});
var async = require('async');
var formatter = require('dateformat');

module.exports = {

    readSteps: function(req,res) {
        var csvPath = './csv/historical_data.csv';
        var resultArray = [];
        converter.on("end_parsed", function (jsonArray) {
            //歩数が同じ時分秒は無視する
            var stepcount = 0;
            for(i = 0; i < jsonArray.length; i++) {

                if (stepcount != jsonArray[i].st) {
                    //比較用の歩数をセット
                    stepcount = jsonArray[i].st;
                    jsonArray[i].Date = formatter(new Date(jsonArray[i].Time), 'yyyy-mm-dd HH:mm:ss');
                    resultArray.push(jsonArray[i]);
                } else {
                    continue;
                }
            }
            res.json(JSON.parse(JSON.stringify(resultArray)));

        });
        fs.createReadStream(csvPath).pipe(converter);
    }

};
