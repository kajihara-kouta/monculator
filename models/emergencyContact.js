var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmergencyContactSchema = new Schema({
//    _id:Number,
    userid: {type:String, required: true, unique: true},
    emergencyname: String,
    postalcd: String,
    address: String,
    telmain: String,
    telsub: String
},{collection:'EmergencyContact'});

module.exports = EmergencyContactSchema;
