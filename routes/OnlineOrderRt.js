/** online order router */
var express = require('express');
var router = express.Router();
var log = require('../common/logger');
var ctrl = require('../controller/OnlineOrderCtrl');

/* online order home */
router.get('/', function(req, res, next) {
  ctrl.getAll(function(err, data) {
    res.json(data);
  });
});

/* create online order */
router.post('/', function(req, res, next) {
  var param = req.params
  ctrl.insert(param, function(err, data) {
    if (err) {
      res.json({
        error: true,
        result: err
      });
    } else {
      res.json({
        error: false,
        result: data
      });
    }
  })
});

module.exports = router;
