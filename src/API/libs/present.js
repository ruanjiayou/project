/**
 * return()/ 返回值json处理,主要是status,code,result
 * paging()/ list()方法的分页
 * abort()/ 处理自定义错误
 * 
 */
const path = require('path');

/**
 * 全局自定义错误类型
 */
global.HinterError = function (fileName, type, detail) {
    this.fileName = fileName;
    this.type = type;
    this.time = new Date().getTime();
    if (detail) {
        this.message = detail;
    }
    return this;
};
global.HinterError.propotype = new Error();

/**
 * 判断是否是空的对象 基本类型 number string boolean null undefined NaN都是true [] {} 也是true
 */
function isEmptyObject(e) {
    for (let t in e)
        return !1;
    return !0;
}

const present = (params) => {
    // 默认设置 分页传参字段/错误提示文件夹
    let d = {
        limit: 'limit',
        page: 'page',
        search: 'search',
        order: 'order',
        errDir: '../templates/errors'
    };
    for (let k in params) {
        d[k] = params[k];
    };
    return (req, res, next) => {
        /**
         * 查询前计算limit和offset
         */
        req.paging = () => {
            let page = parseInt(req.query[d.page]);
            let limit = parseInt(req.query[d.limit]);
            delete req.query[d.page];
            delete req.query[d.limit];
            req.query.page = page ? page : 1;
            req.query.limit = limit ? limit : 50;
        };
        /**
         * 根据分页条件和查询结果构建分页信息
         * @param {object} result findAndCountAll()返回的结果
         * @param {*} info 查询条件中的limit和page
         */
        res.paging = (result, query) => {
            let r = {
                status: true,
                result: result.rows,
                paging: {
                    page: query.page,
                    pages: 1,
                    limit: query.limit,
                    count: result.rows.length,
                    total: result.count
                }
            };
            r.paging.pages = Math.ceil(r.paging.total / r.paging.limit);
            return res.json(r);
        };
        /**
         * 返回json格式的查询结果
         * @param {object} result 
         */
        res.return = (result, params) => {
            let b = result === null ? true : false;
            let t = {
                status: b ? false : true,
                result: b ? null : result
            };
            for (let k in params) {
                t[k] = params[k];
            }
            return res.json(t);
        };
        /**
         * 处理自定义返回错误
         */
        res.errors = (err) => {
            const errorObj = require(path.join(d.errDir, err.fileName))[err.type];
            return res.status(errorObj.statusCode).json({
                status: false,
                code: errorObj.code || 400,
                message: errorObj.message,
                detail: err.message
            });
        };
        next();
    };
};
module.exports = present;