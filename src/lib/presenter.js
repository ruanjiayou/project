const _ = require('lodash');
const errorsJson = require(ERROR_PATH);

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
function preReturn(result, params) {
  if (!_.isNil(result)) {
    if (_.isArray(result)) {
      result = result.map(item => { return item.toJSON ? item.toJSON() : item; });
    } else {
      result = result.toJSON ? result.toJSON() : result;
    }
  }
  const response = {};
  response[RES_STATUS] = result === null ? RES_FAIL : RES_SUCCESS;
  response[RES_DATA] = result;
  return _.assign(response, params);
}

/**
 * 查询前计算limit和offset, 将req.query分为 hql和query
 * @returns page/limit/offset/where/search/order
 */
function reqPaging(cb) {
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
  return hql;
}

/**
 * 返回对象
 */
function returns(result, param) {
  this.json(preReturn(result, param));
}
/**
 * 处理分页
 */
function resPaging(results, query) {
  this.json(prePaging(results, query));
}
/**
 * 返回成功
 */
function success() {
  const response = {};
  response[RES_STATUS] = RES_SUCCESS;
  this.json(response);
}
/**
 * 返回失败
 */
function fail() {
  const response = {};
  response[RES_STATUS] = RES_FAIL;
  this.json(response);
}
/**
 * 处理错误
 */
function error(err) {
  // 语言包验证-模块验证 ['zh-cn']['common']['notFound]
  const errorJson = errorsJson[this.locale || d.defaultLang][err.module][err.type];
  const errInfo = {};
  errInfo[RES_STATUS] = RES_FAIL;
  errInfo[RES_CODE] = errorJson.code || 400;
  errInfo[RES_ERROR] = errorJson.message;
  return this.status(errorJson.statusCode).json(errInfo);
}

module.exports = function (params) {
  return (req, res, next) => {
    req.paging = reqPaging;
    res.return = returns;
    res.paging = resPaging;
    res.success = success;
    res.fail = fail;
    res.error = error;
    next();
  };
}