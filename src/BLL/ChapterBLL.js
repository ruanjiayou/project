const _ = require('lodash');
const BaseBLL = require(BLL_PATH + '/BaseBLL');
const validater = require(LIB_PATH + '/validater');
const thrower = require(LIB_PATH + '/thrower');

class ChapterBLL extends BaseBLL {
  constructor() {
    super();
    this.model = this.models.Chapter;
    this.attributes = this.getAttributes();
  }
}

module.exports = ChapterBLL;