var mongoose = require('mongoose');
var appconfig = require('../props/appconfig.json');
//var user = require('../models/user.js');
//var emergencyContact = require('../models/emergencyContact.js');

var Schema = mongoose.Schema;
var UserSchema = new Schema({
    _id:Number,
    userid: {type:String, required: true, unique: true},
    name: String,
    sex: String,
    birthymd: String,
    postalcd: String,
    address: String,
    tel: String,
    bloodtype: String,
    rhtype: String
});

mongoose.model('User',UserSchema);

module.exports = {
    /* MongoDBへのコネクション取得 */
    getMongoConnection: function() {
        var url = appconfig.mongodb.url;
        var con = mongoose.connect(url);
        var db = con.connection;
        //接続エラー時にコールバック実行
        db.on('error', console.error.bind(console, 'connection error:'));

        //接続成功時にコールバック実行
        db.once('open', function (callback) {
            console.log("connect successfully")
        });

        return mongoose;
    },
    closeMongoConnection: function() {

    }
}
