const _ = require('lodash');
const models = require(MODEL_PATH + '/index');

/**
 * t/transaction: transaction
 * limit/offset/where/order/search
 * where: 同query的where
 * scopes: include数组
 * attributes: include或exclude数组
 * distinct: 去重
 */
/**
 * 设计说明: 继承类尽可能不重写方法
 * 1.采取opts的参数方式: 事物t/关联查询scopes/属性attributes/分页limit,offset/查询order,where
 * 2.model和models成员变量
 */
class BaseBLL {
  constructor() {
    this.models = models;
    this.model = null;
    this.attributes = new Set();
  }
  /**
   * 处理转化参数
   * @param opts 对象处理转换[t][where][query:where,limit,offset,order][scopes][attributes]
   */
  _init(opts) {
    const opt = {
      where: {},
      order: []
    };
    // 允许多次调用_init()
    opts = _.cloneDeep(opts);
    // 分页
    if (_.isInteger(opts.limit)) {
      opt.limit = opts.limit;
    }
    if (_.isInteger(opts.page)) {
      opt.offset = (opts.page - 1) * opt.limit;
    }
    // 事务
    opt.transaction = _.isNil(opts.t) ? null : opts.t;
    if (opts.transaction) {
      opt.transaction = opts.transaction;
    }
    // 关联查询
    opt.scopes = _.isArray(opts.scopes) ? opts.scopes : [];
    if (/^\d+$/.test(opts.where)) {
      opt.where[this.model.primaryKeyAttribute] = opts.where;
    } else if (!_.isNil(opts.where)) {
      opt.where = opts.where;
    }
    // 部分字段,其他的不要/去掉部分字段,其他的都要
    if (_.isString(opts.attributes)) {
      if (opts.attributes[0] === '!') {
        opt.attributes = _.filter(this.attributes, opts.attributes.substr(1).split(','));
      } else {
        opt.attributes = opts.attributes.split(',');
      }
    }
    // 笛卡尔积重复的问题
    if (this.attributes.has(opts.distinct)) {
      opt.include = [];
      opt.distinct = true;
      opt.col = opts.distinct;
    }
    // order排序
    if (_.isString(opts.order)) {
      opts.order = [opts.order];
    }
    if (_.isArray(opts.order)) {
      opts.order.forEach((item) => {
        const [key, method] = item.split('-');
        if (this.attributes.has(key) && (method === 'DESC' || method === 'ASC')) {
          opt.order.push([key, method]);
        }
      });
    }
    return opt;
  }
  /**
   * 执行原生sql语句
   * @param sql sql语句
   */
  async query(sql) {
    const res = await this.models.sequelize.query(sql);
    return res[0];
  }
  /**
   * 获取model的属性数组
   */
  getAttributes() {
    return new Set(this.model.getAttributes());
  }
  /**
   * 生成一个事物
   */
  async getTransaction() {
    return this.models.sequelize.transaction();
  }
  /**
   * 创建
   * @param data 数据
   * @param [t] 事物
   */
  async create(data, t = {}) {
    return this.model.create(data, t);
  };
  /**
   * 删除数据
   */
  async destroy(opts) {
    return this.model.destroy(this._init(opts));
  };
  /**
   * 修改记录
   * @param data 数据
   * @param opts [t][query][scopes][attributes]
   */
  async update(data, opts = {}) {
    const opt = this._init(opts);
    const res = await this.getInfo(opts);
    if (!_.isNil(res)) {
      await res.update(data, opt);
    }
    return res;
  };
  /**
   * 获取所有数据(少数情况)
   * @description query包含 limit/offset/where/order
   * @param opts [t][query][scopes][attributes]
   */
  async getAll(opts = {}) {
    const opt = this._init(opts);
    return this.model.scope(opt.scopes).findAll(opt);
  };
  /**
   * 获取分页列表
   * @description query包含 limit/offset/where/order
   * @param opts [t][query][scopes][attributes]
   */
  async getList(opts = {}) {
    const opt = this._init(opts);
    if (opt.limit === 0) {
      delete opt.offset;
      delete opt.limit;
      return this.model.scope(opt.scopes).findAll(opt);
    } else {
      return this.model.scope(opt.scopes).findAndCountAll(opt);
    }
  };
  /**
   * 获取记录详情
   * @param opts [t][scopes][attributes][query]
   */
  async getInfo(opts = {}) {
    const opt = this._init(opts);
    return this.model.scope(opt.scopes).findOne(opt);
  };
}

module.exports = BaseBLL;