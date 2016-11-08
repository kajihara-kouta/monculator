var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlanStatusSchema = new Schema({
    planid: {type:String, required:true},
    userid: {type: String, required: true},
    status: String,
    enteringdate: Date,
    descendingdate: Date
},{collection:'PlanStatus'});

PlanStatusSchema.index({planid:1, userid:1}, {unique:true});

module.exports = PlanStatusSchema;
