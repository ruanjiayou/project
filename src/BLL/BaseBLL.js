const _ = require('lodash');
const models = require('../models/index');

/**
 * t/transaction: transaction
 * limit/offset/where/order/search
 * where: 同query的where
 * scopes: include数组
 * attributes: include或exclude数组
 * distinct: 去重
 */
// interface Opts {
//   t?: any;
//   transaction?: any;
//   limit
//   offset
//   order
//   search
//   where?: any;
//   scopes?: any;
//   attributes?: any;
//   distinct?: string;
// }
/**
 * 设计说明: 继承类尽可能不重写方法
 * 1.采取opts的参数方式: 事物t/关联查询scopes/属性attributes/分页limit,offset/查询order,where
 * 2.model和models成员变量
 * 3.
 * TODO:
 * 1.transaction 等参数为null 有什么影响? findxxx()里多了scopes
 * 2.多重事物与多次传递opts(主要是t->transaction)
 * 3.只是基础功能, 复杂的要重写
 * 4.排序的字段是model中有的
 */
class BaseBLL {
  // model = null;
  // models = models;
  // attributes = new Set();
  constructor() {
    this.models = models;
  }
  /**
   * 处理转化参数
   * @param opts 对象处理转换[t][where][query:where,limit,offset,order][scopes][attributes]
   */
  _init(opts) {
    const opt = {};
    // 允许多次调用_init()
    opts = _.cloneDeep(opts);
    opt.transaction = _.isNil(opts.t) ? null : opts.t;
    if (opts.transaction) {
      opt.transaction = opts.transaction;
    }
    opt.scopes = _.isArray(opts.scopes) ? opts.scopes : [];
    if (_.isNil(opts.where)) {
      opt.where = {};
    } else if (_.isInteger(opts.where)) {
      opt.where = {};
      opt.where[this.model.primaryKeyAttribute] = opts.where;
    } else {
      opt.where = opts.where;
    }
    // 指定要返回的字段数组,或指定不返还的字段exclude数组
    if (_.isArray(opts.attributes)) {
      opt.attributes = [];
      const exclude = [];
      opts.attributes.forEach((attr) => {
        if (/^[!]/.test(attr) && this.attributes.has(attr.substr(1))) {
          exclude.push(attr.substr(1));
        } else if (this.attributes.has(attr)) {
          opt.attributes.push(attr);
        }
      });
      if (exclude.length !== 0) {
        opt.attributes = { exclude };
      }
    }
    // 笛卡尔积重复的问题
    if (_.isString(opts.distinct) && this.attributes.has(opts.distinct)) {
      opt.include = [];
      opt.distinct = true;
      opt.col = opts.distinct;
    }
    // id或paging()生成的query有limit where offset order
    // order排序
    opt.order = [];
    if (_.isString(opts.order)) {
      opts.order = [opts.order];
    } else if (_.isNil(opts.order)) {
      opts.order = [];
    }
    opts.order.forEach((item) => {
      if (_.isString(item)) {
        const order = item.split('-');
        if (this.attributes.has(order[0]) && ['DESC', 'ASC'].indexOf(order[1]) !== -1) {
          opt.order.push(order);
        }
      }
    });
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
    return this.model.getAttributes();
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
    const res = await this.model.create(data, t);
    return res;
  };
  /**
   * 删除数据
   */
  async destroy(opts) {
    const opt = this._init(opts);
    return await this.model.destroy(opt);
  };
  /**
   * 修改记录
   * @param data 数据
   * @param opts [t][query][scopes][attributes]
   */
  async update(data, opts = {}) {
    const opt = this._init(opts);
    const res = await this.get(opts);
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
    return await this.model.scope(opt.scopes).findAll(opt);
  };
  /**
   * 获取分页列表
   * @description query包含 limit/offset/where/order
   * @param opts [t][query][scopes][attributes]
   */
  async getList(opts = {}) {
    const opt = this._init(opts);
    if (opt.limit === 0) {
      return this.model.scope(opt.scopes).findAll(opt);
    } else {
      return this.model.scope(opt.scopes).findAndCountAll(opt);
    }
  };
  /**
   * 获取记录详情
   * @param opts [t][scopes][attributes][query]
   */
  async get(opts = {}) {
    const opt = this._init(opts);
    return this.model.scope(opt.scopes).findOne(opt);
  };
}

module.exports = BaseBLL;