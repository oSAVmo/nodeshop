/** API router */
const express = require('express');
const router = express.Router();
const log = require('../common/logger');
const erplyCtrl = require('../controller/ErplyAPICtrl');
const erplyCouponCtrl = require('../controller/ErplyCouponCtrl');

/* custom erply API call */
router.post('/custom', function (req, res, next) {
  // get param from request
  let param = req.body.param;
  // call controller
  log.info('calling erplyControl from router...');
  erplyCtrl.customAPICall(param).then(function (result) {
    // response json data
    res.json({
      error: 0,
      result: result
    });
  }).catch(function (reason) {
    // response with error
    log.error('failed because: %s', reason);
    res.json({
      error: reason,
      result: null
    });
  });
});

/* synchronize units */
router.post('/units_sync', function (req, res, next) {
  erplyCtrl.syncUnits().then(function (result) {
    res.json({
      error: 0,
      result: result
    });
  }).catch(function (error) {
    res.json({
      error: error,
      result: null
    });
  });
});

/* synchronize coupon */
router.post('/coupon_sync', function (req, res, next) {
  erplyCouponCtrl.syncIssuedCoupons().then(result => {
    res.json({
      error: 0,
      result: result
    });
  }).catch(error => {
    res.json({
      error: error,
      result: null
    });
  });
});

/** disable coupons: {couponCode: string} */
router.post('/coupon_disable', function (req, res, next) {
  let param = {
    COUPON_CODE: req.body.couponCode === '' ? null : req.body.couponCode
  };
  erplyCouponCtrl.expireCoupons(param).then(result => {
    res.json({
      error: 0,
      result: result
    });
  }).catch(error => {
    res.json({
      error: error,
      result: null
    });
  });
});

router.get('/couponcode', function (req, res, next) {
  erplyCouponCtrl.getUniqCouponCode().then(result => {
    res.json({
      error: 0,
      result: result
    });
  }).catch(error => {
    res.json({
      error: error,
      result: null
    });
  });
});

module.exports = router;