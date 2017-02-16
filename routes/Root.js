/** Home router */
var express = require('express');
var router = express.Router();
var log = require('../common/logger');

/* home page. */
router.get('/', function(req, res, next) {

  res.redirect('index.html');
});

router.post('/', function(req, res, next) {
  var rt = {
    title: 'This test works.'
  };
  res.json(rt);
});

module.exports = router;
