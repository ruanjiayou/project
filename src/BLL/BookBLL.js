const _ = require('lodash');
const auth = require(LIB_PATH + '/authHelper');
const BaseBLL = require(BLL_PATH + '/BaseBLL');
const UserBLL = require(BLL_PATH + '/UserBLL');
const ClassifyBLL = require(BLL_PATH + '/ClassifyBLL');
const validater = require(LIB_PATH + '/validater');
const thrower = require(LIB_PATH + '/thrower');

class BookBLL extends BaseBLL {
  constructor() {
    super();
    this.model = this.models.Book;
    this.attributes = this.getAttributes();
  }

  async fcreate(input) {
    const validation = new validater({
      rules: {
        authorId: 'required|int',
        authorName: 'required|string',
        name: 'required|string',
        origin: 'string'
      }
    });
    const where = validation.validate(input);
    let book = await this.get({ where: { name: where.name, authorName: where.authorName } });
    if (_.isNil(book)) {
      book = await this.create(input);
    }
    return book;
  }

  async create(input) {
    const validation = new validater({
      rules: {
        authorId: 'required|int',
        authorName: 'required|string',
        name: 'required|string',
        poster: 'empty|string|default:""',
        origin: 'string',
        description: 'empty|string|default:""',
        tags: 'required|array|default:array|format:string',
        catalogs: 'required|array|default:array|format:string',
        status: 'enum:loading,finished|default:"loading"',
        isApproved: 'boolean|default:true',
        words: 'int|default:0',
        comments: 'int|default:0',
        collections: 'int|default:0',
        recommends: 'int|default:0',
        scores: 'int|default:5',
        cId: 'int'
      }
    });
    const data = validation.validate(input);
    const classify = (await new ClassifyBLL()).get({ where: data.cId });
    if (_.isNil(classify)) {
      thrower('common', 'notFound');
    } else {
      data['cName'] = classify['name'];
    }
    const result = await this.model.create(data);
    return result;
  }

  /**
   * 修改书籍
   * @param poster 书籍封面
   * @param description 书籍描述
   * @param status 书籍状态
   * @param isApproved 是否禁止
   * @param words 书籍字数
   */
  async update(input, opts = []) {
    const opt = this._init(opts);
    const validation = new validater({
      rules: {
        poster: 'empty|string',
        description: 'empty|string',
        status: 'enum:finished|default:finished',
        isApproved: 'boolean',
        words: 'int',
        comments: 'int',
        collections: 'int',
        recommends: 'int',
        scores: 'int'
      }
    });
    const data = validation.validate(input);
    const res = await this.get(opts);
    if (!_.isNil(res)) {
      await res.update(data, opt);
    }
    return res;
  }

  //TODO:发布时间 修改时间 字数 
  async getList(opts = {}) {
    const Op = this.models.Op;
    const opt = this._init(opts);
    if (!_.isNil(opts.search) && opts.search !== '') {
      opt.where[Op.or] = [
        { name: { [Op.like]: `%${opts.search}%` } },
        { authorName: { [Op.like]: `%${opts.search}%` } }
      ];
    }
    const result = await this.model.scope(opt.scopes).findAndCountAll(opt);
    return result;
  }
}

module.exports = BookBLL;