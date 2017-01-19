const
Shopify = require('shopify-api-node');
const
conf = require('../config/conf').shopifyTest;

const
shopify = new Shopify({
  shopName : conf.shopName,
  apiKey : conf.APIKey,
  password : conf.password,
  autoLimit : conf.autoLimit
});

module.exports = shopify;