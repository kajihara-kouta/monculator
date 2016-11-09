var express = require('express');
var router = express.Router();
var async = require('async');
var sendmail = require('../mailor.js');
var dateformat = require('dateformat');
var utils = require('../common/util.js');
var db = utils.getMongoConnection();
//登山ステータス
var PlanStatus = db.model('PlanStatus');
//緊急連絡先
var EmergencyContact = db.model('EmergencyContact');
//ユーザー情報
var User = db.model('User');
//登山計画書情報
var Plan = db.model('Plan');


//プラン単位のステータス
router.get('/get/:planid', function(req,res,next) {
    var planid = req.params.planid;
    console.log(planid);
    PlanStatus.find({planid: planid}, function(err, results) {
        if (err) throw new Error(err);
        for (i in results) {
            var result = results[i];
            var tmpEnteringDate = result.enteringdate;
            result.enteringdate = utils.editISODate(tmpEnteringDate);
            var tmpDescendingDate = result.descendingdate;
            result.descendingdate = utils.editISODate(tmpDescendingDate);
        };
        res.send(results);
    });
});

router.get('/get/:planid/:userid', function(req,res,next) {
    var planid = req.params.planid;
    var userid = req.params.userid;

    PlanStatus.findOne({planid: planid, userid: userid}, function(err, result) {
        if (err) throw new Error(err);
        if (result == null) {
            res.send({});
        } else {
            var tmpEnteringDate = result.enteringdate;
            result.enteringdate = utils.editISODate(tmpEnteringDate);
            var tmpDescendingDate = result.descendingdate;
            result.descendingdate = utils.editISODate(tmpDescendingDate);
            res.send(result);
        }
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
    async.waterfall([
        function(callback) {
            planStatus.save(function(err) {
                if (err) {
                    console.log(err);
                    res.send({result: false, message:'insert failed'});
                } else {
                    //レスポンスデータの編集
                    planStatus.enteringdate = utils.editISODate(planStatus.enteringdate);
                    resData['planStatus'] = planStatus;
                    resData['result'] = true;
                    resData['message'] = 'insert ok';
//                    res.send(resData);
                    callback(null, resData);
                }
            });
        }, function (arg0, callback) {//arg0:resData
            //緊急連絡先を取得する
            console.log(arg0.planStatus.userid);
            EmergencyContact.findOne({userid : arg0.planStatus.userid}, function(err, result) {
                if (err) throw new Error(err);
                console.log(result);
                callback(null,arg0, result);
            });
        }, function(arg0, arg1, callback) {//arg0:resData, arg1:緊急連絡先
            //ユーザ情報を取得する
            User.findOne({userid : arg0.planStatus.userid}, function(err, result) {
                if (err) throw new Error(err);
                callback(null, arg0, arg1, result);
            })
        }, function(arg0, arg1, arg2, callback) {//arg0:resData, arg1:緊急連絡先, arg2:ユーザ情報
            //登山計画情報を取得する
            Plan.findOne({_id: arg0.planStatus.planid}, function(err, result) {
                if (err) throw new Error(err);
                callback(null, arg0,arg1,arg2,result);
            })
        }, function(arg0, arg1, arg2, arg3, callback) {
            //メールを送信する
            sendmail.sendMessage(arg1.email, arg2.name, arg0.planStatus.status, utils.getMountainById(arg3.mountain).mountainName);
            callback(null, arg0, arg1, arg2, arg3);
        }
    ], function(err, arg0, arg1, arg2, arg3) {
        if (err) throw new Error(err);
        res.send(arg0);
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
