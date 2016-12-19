var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json({data: 'This is the shopify access portal.'});
});

router.get('/portal', function(req, res, next) {
  res.json({error: 0, data: {name: 'test', value: 'this is a test value', number: 16}, message: 'SUCCESS'});
});

module.exports = router;