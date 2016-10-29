var express = require('express');
var router = express.Router();
var utils = require('../common/util.js');
var db = utils.getMongoConnection();

var Plan = db.model('Plan');

//プラン情報1件取得
router.get('/get/:_id', function(req,res,next) {
    //対象のIDを取得
    var targetid = req.params._id;
    Plan.findOne({_id:targetid}, function(err,result) {
        if (err) throw new Error(err);
        res.send(result);
    });
});
//ユーザごとのプラン情報取得
router.get('/get/user/:userid', function(req,res,next) {
    //対象のユーザIDを取得
    var targetid = req.params.userid;
    Plan.find({userid:targetid}, function(err, result) {
        if (err) throw new Error(err);
        res.send(result);
    })
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
    plan.save(function(err) {
        if (err) throw new Error(err);
        else res.send('insert ok');
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

//YYYY-MM-DDをDate型に変換します
function editDate(param) {
    var result;
    (param != undefined)? result = new Date(param + ' 00:00:00'):result =  undefined;
    return result;
}

module.exports = router;