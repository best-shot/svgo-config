const config = require('../config.cjs');
const { Json } = require('fs-chain');

new Json()
  .config({ pretty: true })
  .handle(() => config)
  .output('../config.json');
