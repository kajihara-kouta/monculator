var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContractSchema = new Schema({
    planid: {type:String, required:true, unique:true},
    premium: Number
}, {collection:'Contract'});

module.exports = ContractSchema;
