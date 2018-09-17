const _ = require('lodash');
const auth = require(LIB_PATH + '/authHelper');
const BaseBLL = require(BLL_PATH + '/BaseBLL');
const validater = require(LIB_PATH + '/validater');
const thrower = require(LIB_PATH + '/thrower');

class ClassifyBLL extends BaseBLL {
  constructor() {
    super();
    this.model = this.models.Classify;
    this.attributes = this.getAttributes();
  }
}

module.exports = ClassifyBLL;