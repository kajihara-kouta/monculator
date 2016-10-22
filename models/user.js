var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
//    _id:Number,
    userid: {type:String, required: true, unique: true},
    name: String,
    sex: String,
    birthymd: String,
    postalcd: String,
    address: String,
    tel: String,
    bloodtype: String,
    rhtype: String
},{collection:'User'});

module.exports = UserSchema;
