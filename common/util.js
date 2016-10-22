var mongoose = require('mongoose');
//configuration
var appconfig = require('../props/appconfig.json');
//Schema
var user = require('../models/user.js');
var emergencyContact = require('../models/emergencyContact.js');

//collectionのセット
mongoose.model('User',user);
mongoose.model('EmergencyContact',emergencyContact);
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
