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
  async getInfo(opts = {}) {
    const opt = this._init(opts);
    let res = await this.model.scope(opt.scopes).findOne(opt);
    if (res) {
      res = res.toJSON();
      res.prev = await this.model.findOne({ order: [['id', 'DESC']], attributes: ['id', 'bookId', 'title'], where: { bookId: res.bookId, id: { [this.models.Op.lt]: res.id } } });
      res.next = await this.model.findOne({ attributes: ['id', 'bookId', 'title'], where: { bookId: res.bookId, id: { [this.models.Op.gt]: res.id } } });
    }
    return res;
  }
}

module.exports = ChapterBLL;