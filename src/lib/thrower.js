const Hinter = require('./Hinter');

function thrower(module, type) {
  throw new Hinter(module, type);
}

module.exports = thrower;