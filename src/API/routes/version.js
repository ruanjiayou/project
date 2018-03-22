const imageBLL = global.$BLLs.Image;
const configs = global.$configs;
const debug = require('debug')('APP:VERSION_ROUTE');

module.exports = {
  'use /api/:version(^v[0-9]+$)': function (req, res, next) {
    debug('enter use version route!');
    if (configs.version[req.params.version] === true) {
      next();
    } else {
      next(new Error('api version unused'));
    }
  }
};