var express = require('express');
var router = express.Router();
var utils = require('../common/util.js');
var db = utils.getMongoConnection();
var EmergencyContact = db.model('EmergencyContact');

//1件取得
router.get('/get/:userid', function(req,res,next) {
    var targetid = req.params.userid;
    EmergencyContact.findOne({userid:targetid}, function(err, result) {
        if (err) throw new Error(err);
        res.send(result);
    })
});

//全件取得
router.get('/get', function(req,res,next) {
    EmergencyContact.find({}, function(err, result) {
        console.log(result);
        res.send(result);
    })
});

//1件登録
router.post('/insert', function(req,res,next) {
    var emergencyContact = new EmergencyContact();
    emergencyContact.userid = req.body.userid;
    emergencyContact.emergencyname = req.body.emergencyname;
    emergencyContact.postalcd = req.body.postalcd;
    emergencyContact.address = req.body.address;
    emergencyContact.telmain = req.body.telmain;
    emergencyContact.telsub = req.body.telsub;
    emergencyContact.save(function(err) {
        if (err) throw new Error(err);
        else res.send('insert ok');
    })
});

//1件削除
router.delete('/delete/:userid', function(req,res,next) {
    var targetuserid = req.params.userid;
    EmergencyContact.remove({userid : targetuserid}, function(err,result) {
        if (err) throw new Error(err);
        else res.send('delete completed');
    });
});

router.put('/update/:userid', function(req,res,next) {
    //更新対象のユーザID取得
    var targetid = req.params.userid;
    //更新ターゲット
    var target = {};
    utils.editjsonfordb(req.body.emergencyname, 'emergencyname', target);
    utils.editjsonfordb(req.body.postalcd, 'postalcd', target);
    utils.editjsonfordb(req.body.address, 'address',target);
    utils.editjsonfordb(req.body.telmain, 'telmain', target);
    utils.editjsonfordb(req.body.telsub, 'telsub', target);
    EmergencyContact.update({userid: targetid}, target, function(err, result) {
        if (err) throw new Error(err);
        console.log(result);
        //更新対象がない、もしくは更新内容がない場合
        if (result.nModified == 0) {
            res.send({msg: 'no update'});
        } else {
            res.send({msg: 'update ok'});
        }
    });
});

module.exports = router;
