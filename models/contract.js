var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContractSchema = new Schema({
    planid: {type:String, required:true, unique:true},
    userid: String,
    totalpremium: Number,
    premium: Number,
    partypremium: [{partyid: String, premium:Number}]
}, {collection:'Contract'});

module.exports = ContractSchema;
