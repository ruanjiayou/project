const _ = require('lodash');
const Hinter = require(LIB_PATH + '/Hinter');
const errorsJson = require(ERROR_PATH);
const http = require('http');

/**
 * 根据分页条件和查询结果构建分页信息
 * @param {object} result findAndCountAll()或findAll()返回的结果
 * @param {object} query 查询条件中的limit和page, req.paging中得到
 * @returns status/result/paging
 */
function prePaging(result, query) {
  let rows = result ? result.rows.map(function (item) { return item.toJSON ? item.toJSON() : item; }) : [];
  let total = result ? result.count : 0;
  const response = {};
  response[RES_STATUS] = RES_SUCCESS;
  response[RES_DATA] = rows;
  if (!_.isEmpty(query)) {
    response[RES_PAGINATOR] = {};
    response[RES_PAGINATOR][RES_PAGINATOR_PAGE] = query.page;
    response[RES_PAGINATOR][RES_PAGINATOR_PAGES] = Math.ceil(total / query.limit);
    response[RES_PAGINATOR][RES_PAGINATOR_LIMIT] = query.limit;
    response[RES_PAGINATOR][RES_PAGINATOR_COUNT] = rows.length;
    response[RES_PAGINATOR][RES_PAGINATOR_TOTAL] = total;
  }
  return response;
}

/**
 * 返回json格式的查询结果
 * @param {object} result 记录对象
 * @param {object} [params] 可选参数
 * @returns status/result
 */
function preReturn(result, params = {}) {
  if (!_.isNil(result)) {
    if (_.isArray(result)) {
      result = result.map(item => { return item.toJSON ? item.toJSON() : item; });
    } else {
      result = result.toJSON ? result.toJSON() : result;
    }
  }
  const response = {};
  response[RES_STATUS] = _.isNil(result) ? RES_FAIL : RES_SUCCESS;
  response[RES_DATA] = result;
  return _.assign(response, params);
}

function preError(err) {
  if (err instanceof Hinter) {
    // 语言包验证-模块验证 ['zh-cn']['common']['notFound]
    const errorJson = errorsJson[this.locale || d.defaultLang][err.module][err.type];
    const errInfo = {};
    errInfo[RES_STATUS] = RES_FAIL;
    errInfo[RES_CODE] = errorJson.code || 400;
    errInfo[RES_ERROR] = errorJson.message;
    return errInfo;
  } else if (err) {
    const result = {};
    result[RES_STATUS] = RES_FAIL;
    result[RES_ERROR] = `${err.message}`;
    return result;
  } else {
    return undefined;
  }
}

/**
 * 查询前计算limit和offset, 将req.query分为 hql和query
 * @returns page/limit/offset/where/search/order
 */
function paging(cb) {
  let hql = { where: {} };
  const query = this.query;

  let page = parseInt(query[REQ_PAGE]);
  let limit = parseInt(query[REQ_LIMIT]);
  let order = query[REQ_ORDER];
  let search = query[REQ_SEARCH];

  delete query[REQ_PAGE];
  delete query[REQ_LIMIT];
  delete query[REQ_ORDER];
  delete query[REQ_SEARCH];

  hql.page = page || 1;
  hql.limit = limit || 20;
  hql.offset = (hql.page - 1) * hql.limit;

  if (!_.isEmpty(order)) {
    hql.order = order;
  }
  if (!_.isEmpty(search)) {
    hql.search = search;
  }
  if (cb && typeof cb === 'function') {
    hql = cb(hql, query);
  }
  this.paginator = _.clone(hql);
  return hql;
}

/**
 * 返回成功
 */
function success() {
  return preReturn({});
}
/**
 * 返回失败
 */
function fail(data) {
  const response = {};
  response[RES_STATUS] = RES_FAIL;
  if (data) {
    response[RES_DATA] = data;
  }
  return response;
}

/**
 * 对返回的数据的统一封装处理
 */
function formatResponse(result) {
  if (result === undefined || result === null) {
    this.end();
  } else if (typeof result === 'string') {
    this.write(result);
    this.end();
  } else if (!_.isNil(this.paginator)) {
    this.json(this.paging(result, this.paginator));
  } else if (!(result instanceof http.ServerResponse)) {
    this.json(result);
  } else {
    // stream
  }
}

module.exports = {
  // 处理请求条件
  paging,
  // 预处理返回的分页
  prePaging,
  // 预处理返回的对象
  preReturn,
  // 预处理返回的错误
  preError,
  // 简便方法 success和fail
  success,
  fail,
  // 服务器输出响应: string/object/直接结束(options)
  formatResponse
};