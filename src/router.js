const _ = require('lodash');
const loader = require(LIB_PATH + '/loader');
let routes = [];

/**
 * 调整路由数组
 */
function adjustRoutes(arr) {
  function compare(str1, str2) {
    let len1 = str1.length,
      len2 = str2.length;
    for (let i = 0; i < len1 && i < len2; i++) {
      if (str1[i] === ':' || str1[i] === '*') {
        return -1;
      }
      if (str2[i] === ':' || str2[i] === '*') {
        return 1;
      }
      if (str1.charCodeAt(i) !== str2.charCodeAt(i)) {
        return str1.charCodeAt(i) - str2.charCodeAt(i);
      }
    }
    return len1 - len2;
  }
  arr.sort(function (a, b) {
    if (a.type === 'use' || b.type === 'use') {
      if (a.type === b.type) {
        return compare(a.path, b.path);
      } else {
        return a.type === 'use' ? -1 : 1;
      }
    }
    return compare(a.path, b.path);
  });
  return arr;
}
/**
 * 处理路由文件
 * @param {object} info 路径信息
 */
function handler(info, type = 'API') {
  let route = require(info.fullpath);
  Object.keys(route).forEach(key => {
    // 转化为可以排序的对象
    const [method, apipath] = key.split(' ');
    //app[method](apipath, route[key]);
    const o = {
      type: method.toLowerCase(),
      path: apipath,
      handle: route[key]
    };
    routes.push(o);
    if (type === 'route') {
      DEFAULT_INDEX.forEach(index => {
        routes.push({
          type: o.type,
          path: `${o.path}${index}`,
          handle: route[key]
        });
      });
    }
  });
}
/**
 * 加载所有路由
 */
loader({
  dir: APP_PATH + '/routes',
  recusive: true
}, handler);
/**
 * 加载所有控制器
 */
loader({
  dir: APP_PATH + '/controller',
  recusive: true
}, (info) => {
  handler(info, 'route');
});

module.exports = function (app) {
  // 排序
  routes = adjustRoutes(routes);
  // 挂载到app上
  routes.forEach((route) => {
    app[route.type](route.path, async function (req, res, next) {
      // 组合API特定格式
      if (req.headers['x-api'] === 'group' && req.method === 'POST' && req.originalUrl === '/v1/api-group') {
        const results = [];
        const apis = req.body;
        // 处理组合API数组
        for (let i = 0; i < apis.length; i++) {
          const api = apis[i];
          // 防止循环错误
          if (api.url === '/v1/api-group') {
            results.push(res.error({ module: 'common', type: 'recursive' }));
            continue;
          }
          let found = false, err = undefined;
          //与所有路由匹配
          for (let j = 0; j < routes.length; j++) {
            const R = routes[j];
            req.method = api.method;
            req.originalUrl = api.url;
            req.query = api.query;
            req.body = api.body;
            req.params = {};
            // TODO:reg-path匹配 var pathRegexp = require('path-to-regexp');
            if (R.path !== api.url) {
              continue;
            }
            if (R.type === 'use' || R.type === api.method) {
              try {
                if (R.type === 'use') {
                  //R.handle(req, res, function (e) { });
                } else {
                  // 匹配跳出或错误跳出
                  found = true;
                  results.push(R.handle(req, res, function (e) { }));
                  break;
                }
              } catch (e) {
                results.push(res.error(e));
              }
            }
          }
          if (!found) {
            results.push(res.error({ module: 'common', type: '404' }));
          }
        }
        res.formatResponse(results);
      } else {
        // 普通API
        try {
          const result = await route.handle(req, res, next);
          res.formatResponse(result);
        } catch (e) {
          next(e);
        }
      }
    });
  });
}