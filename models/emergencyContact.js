var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmergencyContactSchema = new Schema({
    userid: {type:String, required: true, unique: true},
    emergencyname: String,
    postalcd: String,
    address: String,
    telmain: String,
    telsub: String
});

module.exports = mongoose.model('EmergencyContact',EmergencyContactSchema);
