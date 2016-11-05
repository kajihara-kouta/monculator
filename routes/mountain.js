var express = require('express');
var router = express.Router();
var utils = require('../common/util.js');

//全件取得
router.get('/get', function(req,res,next) {
    res.send(utils.getMountainsAll());
});

//山の名前で取得（できてないけど）
router.get('/get/byname/:name', function(req,res,next) {
    res.send(utils.getMountainByName(req.params.name));
});

//ID指定取得
router.get('/get/byid/:id', function(req,res,next) {
    res.send(utils.getMountainById(req.params.id));
});

module.exports = router;
