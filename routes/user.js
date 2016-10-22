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



module.exports = router;
