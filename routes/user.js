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
        res.send(user);
    });
});

//全件取得
router.get('/get', function(req,res,next) {
    User.find({}, function(err, result) {
        console.log(result);
        res.send(result);
    })
});
//1件登録
router.post('/insert', function(req,res,next) {

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
        if (err) throw err;
        else res.send('insert ok');
    })
});

//1件削除
router.delete('/delete/:userid', function(req,res,next) {
    var targetuserid = req.params.userid;
    User.remove({userid : targetuserid}, function(err,result) {
        if (err) throw new Error(err);
        else
            //            console.log(result);
            res.send('delete completed');
    });
});

//1件更新
router.put('/update', function(req,res,next) {
    var tmpuserid,tmpname,tmpsex,tmpbirthymd,tmppostalcd,tmpaddress,tmptel,tmpbloodtype,tmprhtype;
    if(req.body.userid == undefined || req.body.userid == null || req.body.userid == '')
        res.status(500);
    console.log(req.body.userid);
    console.log(req.body.name);
    (req.body.userid != undefined)? tmpuserid = req.body.userid : tmpuserid = undefined;
    (req.body.name != undefined)? tmpname = req.body.name : tmpname = undefined;
    (req.body.sex != undefined)? tmpsex = req.body.sex : tmpsex = undefined;
    (req.body.birthymd != undefined)? tmpbirthymd = req.body.birthymd : tmpbirthymd = undefined;
    (req.body.postalcd != undefined)? tmppostalcd = req.body.postalcd : tmppostalcd = undefined;
    (req.body.address != undefined)? tmpaddress = req.body.address : tmpaddress = undefined;
    (req.body.tel != undefined)? tmptel = req.body.tel : tmptel = undefined;
    (req.body.bloodtype != undefined)? tmpbloodtype = req.body.bloodtype : tmpbloodtype = undefined;
    (req.body.rhtype != undefined)? tmprhtype = req.body.rhtype : tmprhtype = undefined;
    console.log(tmpuserid,tmpname,tmpsex,tmpbirthymd,tmppostalcd,tmpaddress,tmptel,tmpbloodtype,tmprhtype);
    //更新ターゲット
    var target = {};
//    if (tmpuserid != undefined) target['userid'] = tmpuserid;
    if (tmpname != undefined) target['name'] = tmpname;
    if (tmpsex != undefined) target['sex'] = tmpsex;
    if (tmpbirthymd != undefined) target['birthymd'] = tmpbirthymd;
    if (tmppostalcd != undefined) target['postalcd'] = tmppostalcd;
    if (tmpaddress != undefined) target['address'] = tmpaddress;
    if (tmptel != undefined) target['tel'] = tmptel;
    if (tmpbloodtype != undefined) target['bloodtype'] = tmpbloodtype;
    if (tmprhtype != undefined) target['rhtype'] = tmprhtype;
    User.update({userid: tmpuserid}, target, function(err, result) {
        if (err) throw new Error(err);
        console.log(result);
        //更新対象がない、もしくは更新内容がない場合
        if (result.nModified == 0) {
            res.send({msg : 'no update'});
        } else {
            res.send({msg : 'update ok'});
        }
    });
});


module.exports = router;
