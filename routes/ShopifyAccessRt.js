var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json({data: 'This is the shopify access portal.'});
});

module.exports = router;