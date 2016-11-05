var utils = require('../common/util.js');

//基準保険料
var basisPremium = utils.getPremiumParameterByKey('basispremium');
//基準保険期間
var basisInsPeriod = utils.getPremiumParameterByKey('basisinsperiod');
//基準年齢
var standardAge = utils.getPremiumParameterByKey('standardage');

module.exports = {
    //保険料計算
    calcPremium: function(fromdate, todate, age, mountainId) {
        //難易度
        var difficulty = utils.getMountainById(mountainId).difficulty;
        //切り上げた値を日数とする
        var period = Math.ceil((new Date(todate).getTime() - new Date(fromdate).getTime())/(1000*60*60*24));
        //年齢によるレート
        var agerate = (age > 50)? age/50:1;
        //TODO 天気の情報
        //保険料
        var premium = basisPremium * (period/basisInsPeriod) * agerate * difficulty;
        return premium;
    }
}
