var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
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

module.exports = mongoose.model('User',UserSchema);
