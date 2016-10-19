var express = require('express');
var router = express.Router();
var utils = require('../common/util.js');
//var User = require('../models/user.js');
var mongoose = utils.getMongoConnection();
//    console.log(db);
var User = mongoose.model('User');

router.get('/get/:userid', function(req,res,next) {
    /* useridを取得*/
    var targetuserid = req.params.userid;
    console.log('userid is:', targetuserid);

    console.log(User);
    User.findOne({userid : targetuserid},function(err, user) {
        if (err) throw new Error(err);
        console.log('target userid is:', targetuserid);
        console.log(user);
        res.send(user);
    });
});

router.get('/get', function(req,res,next) {
    User.find({}, function(err, result) {
        console.log(result);
        res.send(result);
    })
})

router.get('/', function(req,res,next) {
    res.send('ok');
})




module.exports = router;
