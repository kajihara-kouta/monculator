var express = require('express');
var router = express.Router();
var utils = require('../common/util.js');
var db = utils.getMongoConnection();
var User = db.model('User');

//1件取得
router.get('/get/:userid', function(req,res,next) {
    /* useridを取得*/
    var targetuserid = req.params.userid;

    User.findOne({userid : targetuserid},function(err, user) {
        if (err) throw new Error(err);
        var str = user.postalcd;
        if(!str.match(/[^0-9]/g)) {
            var convert = str.substring(0,3) + '-' + str.substring(3);
            user.postalcd = convert;
        }
        console.log(user.postalcd);
        res.send(user);
    });
});

//全件取得
router.get('/get', function(req,res,next) {
    User.find({}, function(err, result) {
        for (i in result) {
            var str = result[i].postalcd;
            if(!str.match(/[^0-9]/g)) {
                var convert = str.substring(0,3) + '-' + str.substring(3);
                result[i].postalcd = convert;
            }
        }
        console.log(result);
        res.send(result);
    })
});
//1件登録
router.post('/insert', function(req,res,next) {
    //郵便番号チェック
    var postCode = req.body.postalcd;
    if (!postCode.match(/^\d{3}-?\d{4}$/)) {
        res.send({result:false, message:'postalcd invalid'});
    }
    var user = new User();
    user.userid = req.body.userid;
    user.name = req.body.name;
    user.sex = req.body.sex;
    user.birthymd = req.body.birthymd;
    user.postalcd = req.body.postalcd;
    user.address = req.body.address;
    user.tel = req.body.tel;
    user.bloodtype = req.body.bloodtype;
    user.rhtype = req.body.rhtype;
    user.save(function(err) {
        if (err) res.send({result:false, message:'insert failed'});
        else res.send({result: true, message:'insert ok'});
    })
});

//1件削除
router.delete('/delete/:userid', function(req,res,next) {
    var targetuserid = req.params.userid;
    User.remove({userid : targetuserid}, function(err,result) {
        if (err) throw new Error(err);
        else res.send('delete completed');
    });
});

//1件更新
router.put('/update/:userid', function(req,res,next) {
    //郵便番号チェック
    var postCode = req.body.postalcd;
    if (postCode != undefined) {
        if (!postCode.match(/^\d{3}-?\d{4}$/)) {
            res.send({result:false, message:'postalcd invalid'});
        }
    }
    //更新対象のユーザID取得
    var targetid = req.params.userid;
    //更新ターゲット
    var target = {};
    utils.editjsonfordb(req.body.name, 'name', target);
    utils.editjsonfordb(req.body.sex, 'sex', target);
    utils.editjsonfordb(req.body.birthymd, 'birthymd', target);
    utils.editjsonfordb(req.body.postalcd, 'postalcd', target);
    utils.editjsonfordb(req.body.address, 'address', target);
    utils.editjsonfordb(req.body.tel, 'tel', target);
    utils.editjsonfordb(req.body.bloodtype, 'bloodtype', target);
    utils.editjsonfordb(req.body.rhtype, 'rhtype', target);
    //更新処理
    User.update({userid: targetid}, target, function(err, result) {
        if (err) throw new Error(err);
        console.log(result);
        //更新対象がない、もしくは更新内容がない場合
        if (result.nModified == 0) {
            res.send({result: false, message : 'no update'});
        } else {
            res.send({result: true, message : 'update ok'});
        }
    });
});


module.exports = router;
