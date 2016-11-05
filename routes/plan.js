var express = require('express');
var router = express.Router();
var utils = require('../common/util.js');
var db = utils.getMongoConnection();
var dateformat = require('dateformat');
var calc = require('../common/calc.js');
var async = require('async');

var Plan = db.model('Plan');
var User = db.model('User');

//プラン情報1件取得
router.get('/get/:_id', function(req,res,next) {
    //対象のIDを取得
    var targetid = req.params._id;
    Plan.findOne({_id:targetid}, function(err,result) {
        if (err) throw new Error(err);
        var tmpfromdate = result.fromdate;
        result.fromdate = editISODate(tmpfromdate);
        var tmptodate = result.todate;
        result.todate = editISODate(tmptodate);
        res.send(result);
    });
});
//ユーザごとのプラン情報取得
router.get('/get/user/:userid', function(req,res,next) {
    //対象のユーザIDを取得
    var targetid = req.params.userid;
    Plan.find({userid:targetid}, function(err, result) {
        if (err) throw new Error(err);
        for (i in result) {
            var tmpfromdate = result[i].fromdate;
            result[i].fromdate = editISODate(tmpfromdate);
            var tmptodate = result[i].todate;
            result[i].todate = editISODate(tmptodate);
        }
        res.send(result);
    })
});

//全件取得
router.get('/get', function(req,res,next) {
    Plan.find({}, function(err, result) {
        if (err) throw new Error(err);
        for (i in result) {
            var tmpfromdate = result[i].fromdate;
            result[i].fromdate = editISODate(tmpfromdate);
            var tmptodate = result[i].todate;
            result[i].todate = editISODate(tmptodate);
        }
        res.send(result);
    });
});

//プラン情報登録
router.post('/insert', function(req,res,next) {
    console.log(req.body);
    var plan = new Plan();
    plan.userid = req.body.userid;
    plan.planname = req.body.planname;
    //{parties:[xxxx,xxxx,xxxx,...]}
    var partiesparam = req.body.parties.partyid;
    var parties = [];
    for (party in partiesparam) {
        parties.push({partyid:partiesparam[party]});
    }
    plan.parties = parties;
    plan.fromdate = editDate(req.body.fromdate);
    plan.todate = editDate(req.body.todate);
    plan.mountain = req.body.mountain;
    plan.route = req.body.route;
    var equipJson = {};
    //装備
    equipJson['equipments'] = req.body.equipments;

    var targetequipments = [];
    for (i = 0; i < equipJson.equipments.length; i++) {
        console.log(equipJson.equipments[i]);
        targetequipments.push(equipJson.equipments[i]);
    }
    var foodsArray = req.body.foods;
    var targetfoods =[];
    for (index in foodsArray) {
        targetfoods.push(foodsArray[index]);
    }
    plan.equipments = targetequipments;
    console.log(plan.equipments);
    plan.foods = targetfoods;
    console.log(plan.foods);
    plan.drink = req.body.drink;
    plan.remark = req.body.remark;
    //TODO 保険料計算対応後置換する
    //合計保険料
    var totalPremium = 0;
    //レスポンス用データ
    var premiumresData = {};
    //パーティ分保険料
    var partyPremiumArray = [];
    //順次処理
    async.waterfall([
        function(callback) {
            //ユーザ情報を取得する
            User.findOne({userid:req.body.userid}, function(err, user) {
                var age = calc.calcAge(user.birthymd);
                var premium = calc.calcPremium(req.body.fromdate, req.body.todate, age, req.body.mountain);
                premiumresData['premium'] = premium;
                totalPremium = totalPremium + premium;
                callback(null, premium);
            });
        }, function(arg0, callback) {
            async.mapSeries(parties, function(data, next) {
                User.findOne({userid:data.partyid}, function(err, user) {

                    var partyage = calc.calcAge(user.birthymd);
                    var partypremium = calc.calcPremium(req.body.fromdate, req.body.todate, partyage, req.body.mountain);
                    //合計保険料
                    totalPremium = totalPremium + partypremium;
                    //パーティ用保険料をセット
                    var tmpdata = {};
                    tmpdata['partyid'] = data.partyid;
                    tmpdata['premium'] = partypremium;
                    partyPremiumArray.push(tmpdata);
                    next(null, user);
                });
            }, function(err, results) {
                callback(null, results);
            });
        },
    ],function(err, arg0) {
        premiumresData['partypremium'] = partyPremiumArray;
        premiumresData['totalpremium'] = totalPremium;
        plan.save(function(err) {
            if (err) res.send({result: false, message:'insert failed'});
            else
                premiumresData['result'] = true;
                premiumresData['message'] = 'insert ok';
                premiumresData['_id'] = plan._id;
                console.log(premiumresData);
                res.send(premiumresData);
        });
    });
});

//プラン情報削除
router.delete('/delete/:_id', function(req,res,next) {
    //対象のIDを取得
    var targetid = req.params._id;
    Plan.remove({_id:targetid}, function(err, result) {
        if (err) throw new Error(err);
        else res.send('delete completed');
    })
});

//プラン情報更新
router.put('/update/:_id',function(req,res,next) {
    //対象のIDを取得
    var targetid = req.params._id;
    var target = {};
    utils.editjsonfordb(req.body.planname, 'planname', target);
    //パーティ情報
    var partyArray;
    (req.body.parties != undefined)?partyArray = req.body.partis:partyArray = undefined;
    if (partyArray != undefined) {
        var array = [];
        for (party in partyArray) {
            array.push({partyid:party});
        }
        target[parties] = array;
    }

    utils.editjsonfordb(editDate(req.body.fromdate), 'fromdate', target);
    utils.editjsonfordb(editDate(req.body.todate), 'todate', target);
    utils.editjsonfordb(req.body.mountain, 'mountain', target);
    utils.editjsonfordb(req.body.route, 'route', target);
    utils.editjsonfordb(req.body.equipments, 'equipments', target);
    utils.editjsonfordb(req.body.foods, 'foods', target);
    utils.editjsonfordb(req.body.remark, 'remark', target);


});

//YYYY-MM-DD HH:MM:SSをDate型に変換します
function editDate(param) {
    var result;
    (param != undefined)? result = new Date(param):result =  undefined;
    return result;
}

//ISODateから日本時間の年月日(YYYY-MM-DD)に変換します
function editISODate(val) {
    //世界標準時＋９時間
    var valMilliSec = new Date(val).getTime() + 9*60*60*1000;
    var jptime = new Date(valMilliSec);
    var year = jptime.getFullYear();
    var month = jptime.getMonth() + 1;
    month = (month <10) ? '0' + month : month;
    var day = jptime.getDate();
    day = (day < 10) ? '0'+day : day;
    var ret = year + '-' + month + '-' + day;
    return ret;
}

module.exports = router;
