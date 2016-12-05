var express = require('express');
var router = express.Router();

var log = require('../config/logger');

/* GET home page. */
router.get('/', function(req, res, next) {
  var rt = {title:'This test works.'};
  log.info('Server reached, returning json: %j', rt);
  res.json(rt);
});

module.exports = router;
