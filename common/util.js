var mongoose = require('mongoose');
//configuration
var appconfig = require('../props/appconfig.json');
//Schema
var user = require('../models/user.js');
var emergencyContact = require('../models/emergencyContact.js');

//collectionのセット
mongoose.model('User',user);
mongoose.model('EmergencyContact',emergencyContact);

module.exports = {
    /* MongoDBへのコネクション取得 */
    getMongoConnection: function() {
        var url = appconfig.mongodb.url;
        var db = mongoose.createConnection(url);

        return db;
    },
    closeMongoConnection: function() {
        mongoose.disconnect();
    }
}
