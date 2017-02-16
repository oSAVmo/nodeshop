/** API router */
const express = require('express');
const router = express.Router();
const log = require('../common/logger');
const erplyCtrl = require('../controller/ErplyAPICtrl');

/* custom erply API call */
router.post('/custom', function(req, res, next) {
  // get param from request
  let param = req.body.param;
  // call controller
  log.info('calling erplyControl from router...');
  erplyCtrl.customAPICall(param).then(function(result) {
    // response json data
    res.json({
      error: 0,
      result: result
    });
  }).catch(function(reason) {
    // response with error
    log.error('failed because: %s', reason);
    res.json({
      error: reason,
      result: null
    });
  });
});

module.exports = router;
