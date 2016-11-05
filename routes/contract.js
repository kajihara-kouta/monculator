var express = require('express');
var router = express.Router();
var utils = require('../common/util.js');
var db = utils.getMongoConnection();

var Contract = db.model('Contract');

//契約情報１件取得(キー指定)
router.get('/get/:planid', function(req,res,next) {
    var planid = req.params.planid;
    Contract.findOne({planid:planid}, function(err, result) {
        if (err) throw new Error(err);
        res.send(result);
    });
});

//契約情報全件取得
router.get('/get', function(req,res,next) {
    Contract.find({}, function(err, result) {
        if (err) throw new Error(err);
        res.send(result);
    })
});

//1件登録
router.post('/insert', function(req, res, next) {
    var planid = req.body.planid;
    var premium = req.body.premium;
    //合計保険料の計算
    var totalpremium = 0;
    totalpremium = totalpremium + premium;
    var partiesArray = req.body.partypremium;
    for (i in partiesArray) {
        totalpremium = totalpremium + partiesArray[i].premium;
    }
    var contract = new Contract();
    contract.planid = planid;
    contract.premium = premium;
    contract.totalpremium = totalpremium;
    contract.partypremium = partiesArray;
    contract.save(function(err) {
        if (err) res.send({result: false, message:'insert failed'});
        else res.send({result: true, message: 'insert ok', _id:contract._id});
    });
});

//1件削除
router.delete('/delete/:planid', function(req, res, next) {
    var planid = req.params.planid;
    Contract.remove({planid: planid}, function(err, result) {
        if (err) res.send({result: false, message:'delete failed'});
        else res.send({result: true, message: 'delete ok'});
    });
});

//1件更新
router.put('/update/:planid', function(req, res, next) {
    var planid = req.params.planid;
    var target = {};
    utils.editjsonfordb(req.body.premium, 'premium', target);
    utils.editjsonfordb(req.body.partypremium, 'partypremium', target);
    if (req.body.partypremium != undefined && req.body.premium != undefined) {
        var totalpremium = 0;
        totalpremium = totalpremium+ req.body.premium;
        var parties = req.body.partypremium;
        for (i in parties) {
            totalpremium = totalpremium + parties[i].premium;
        }
        target['totalpremium'] = totalpremium;
    }
    Contract.update({planid:planid}, target, function(err, result) {
        if (err) throw new Error(err);
        console.log(result);
        if (result.nModified == 0) {
            res.send({result: false, message : 'no update'});
        } else {
            res.send({result: true, message : 'update ok'});
        }
    });
});

module.exports = router;
