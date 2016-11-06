var express = require('express');
var router = express.Router();
var async = require('async');
var dateformat = require('dateformat');
var utils = require('../common/util.js');
var db = utils.getMongoConnection();

var PlanStatus = db.model('PlanStatus');

router.get('/get/:planid/:userid', function(req,res,next) {
    var planid = req.params.planid;
    var userid = req.params.userid;

    PlanStatus.findOne({planid: planid, userid: userid}, function(err, result) {
        if (err) throw new Error(err);
        var tmpEnteringDate = result.enteringdate;
        result.enteringdate = utils.editISODate(tmpEnteringDate);
        var tmpDescendingDate = result.descendingdate;
        result.descendingdate = utils.editISODate(tmpDescendingDate);
        res.send(result);
    });
});

//入山時のリクエスト
router.post('/entering', function(req,res,next) {
    var planid = req.body.planid;
    var userid = req.body.userid;
    var status = 'Entering';
    var enteringDate = dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    console.log(enteringDate);
    var planStatus = new PlanStatus();
    planStatus.planid = planid;
    planStatus.userid = userid;
    planStatus.status = status;
    planStatus.enteringdate = enteringDate;
    var resData = {};
    planStatus.save(function(err) {
        if (err) {
            console.log(err);
            res.send({result: false, message:'insert failed'});
        } else {
            planStatus.enteringdate = utils.editISODate(planStatus.enteringdate);
            resData['planStatus'] = planStatus;
            resData['result'] = true;
            resData['message'] = 'insert ok';
            res.send(resData);
        }
    });
});

//下山時のリクエスト
router.put('/descending', function(req, res, next) {
    var planid = req.body.planid;
    var userid = req.body.userid;
    var status = 'Descending';
    var descendingDate = dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    console.log(descendingDate);
    var resData = {};
    PlanStatus.findOneAndUpdate({planid: planid, userid: userid}, {status:status, descendingdate:descendingDate},{new:true}, function(err, result) {
        if (err) {
            console.log(err);
            res.send({result:false, message: 'update failed'});
        } else {
            result.enteringdate = utils.editISODate(result.enteringdate);
            result.descendingdate = utils.editISODate(result.descendingdate);
            resData['planStatus'] = result;
            resData['result'] = true;
            resData['message'] = 'update ok';
            res.send(resData);
        }
    });
});

router.delete('/delete/:planid/:userid', function(req,res,next) {
    var planid = req.params.planid;
    var userid = req.params.userid;
    PlanStatus.remove({planid:planid, userid:userid}, function(err, result) {
       if (err) res.send({result:false, message: 'delete failed'});
        else res.send({result:true, message: 'delete ok'});
    });
});


module.exports = router;
