var mongoose = require('mongoose');
var dateformat = require('dateformat');
//configuration
var appconfig = require('../props/appconfig.json');
//Schema
var user = require('../models/user.js');
var emergencyContact = require('../models/emergencyContact.js');
var plan = require('../models/plan.js');
var contract = require('../models/contract.js');
var planStatus = require('../models/planstatus.js');

//collectionのセット
mongoose.model('User',user);
mongoose.model('EmergencyContact',emergencyContact);
mongoose.model('Plan', plan);
mongoose.model('Contract', contract);
mongoose.model('PlanStatus', planStatus);
//DB接続
var db = mongoose.createConnection(appconfig.mongodb.url);

module.exports = {
    /* MongoDBへのコネクション取得 */
    getMongoConnection: function() {
        return db;
    },
    /* MongoDBへのコネクション切断 */
    closeMongoConnection: function() {
        mongoose.disconnect();
    },
    /* MongoDB保存用にJSONデータを整形 */
    editjsonfordb: function(reqvalue, key, targetjson) {
        if(reqvalue != undefined) {
            targetjson[key] = reqvalue;
        } else {
            return;
        }
    },
    /* 山の情報を取得 */
    getMountainsAll: function() {
        return appconfig.mountains;
    },
    /* 山の名前から情報を取得 */
    getMountainByName: function(mountainName) {
        var result = appconfig.mountains.filter(function(item, index) {
            if (item.mountainName == mountainName) return true;
        });
        return (result.length ==0)? undefined : result[0];
    },
    /* IDから山の情報を取得 */
    getMountainById: function(mountainId) {
        var result = appconfig.mountains.filter(function(item, index) {
            if (item.mountainId == mountainId) return true;
        });
        return (result.length ==0)? undefined : result[0];
    },
    /* 保険料計算のパラメーターを全件取得 */
    getPremiumParameter: function() {
        return appconfig.premiumparameter;
    },
    /* 指定したキーの保険料計算パラメーターを取得 */
    getPremiumParameterByKey: function(key) {
        return appconfig.premiumparameter[key];
    },
    /* ISODateから日本時間の年月日時分秒に変換します */
    editISODate: function(val) {
        if (val == undefined || val == null) {
            return null;
        }
        var valMilliSec = new Date(val).getTime() + 9*60*60*1000;
        var jptime = new Date(valMilliSec);
        return dateformat(jptime, 'yyyy-mm-dd HH:MM:ss');
    }

}
