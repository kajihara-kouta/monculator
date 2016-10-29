var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlanSchema = new Schema({
    userid: String,
    planname : String,
    parties : [{partyid:String}],
    fromdate : Date,
    todate : Date,
    mountain : String,
    route : String,
    equipments: [{name : String, quantity : Number}],
    foods : [{foodtype : String, quantity : Number}],
    drink : Number,
    remark : String
},{collection:'Plan'});

module.exports = PlanSchema;
