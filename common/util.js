var mongoose = require('mongoose');
//configuration
var appconfig = require('../props/appconfig.json');
//Schema
var user = require('../models/user.js');
var emergencyContact = require('../models/emergencyContact.js');
var plan = require('../models/plan.js');
var contract = require('../models/contract.js');

//collectionのセット
mongoose.model('User',user);
mongoose.model('EmergencyContact',emergencyContact);
mongoose.model('Plan', plan);
mongoose.model('Contract', contract);
//DB接続
var db = mongoose.createConnection(appconfig.mongodb.url);

module.exports = {
    /* MongoDBへのコネクション取得 */
    getMongoConnection: function() {
        return db;
    },
    closeMongoConnection: function() {
        mongoose.disconnect();
    },
    editjsonfordb: function(reqvalue, key, targetjson) {
        if(reqvalue != undefined) {
            targetjson[key] = reqvalue;
        } else {
            return;
        }
    }
}
