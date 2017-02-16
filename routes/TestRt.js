/** Test router */
var testCtrl = require('../controller/Tests');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json({
    info: 'This is the test module.'
  });
});

router.get('/mail', function(req, res, next) {
  testCtrl.testMail(function(info) {
    res.json(info);
  });
});

module.exports = router;
