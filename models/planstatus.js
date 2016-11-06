var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlanStatusSchema = new Schema({
    planid: {type:String, required:true, unique:true},
    userid: {type: String, required: true, unique:true},
    status: String,
    enteringdate: Date,
    descendingdate: Date
},{collection:'PlanStatus'});

module.exports = PlanStatusSchema;
