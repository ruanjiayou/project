const path = require('path');
const fs = require('fs');
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
      try {
        const result = await route.handle(req, res, next);
        if (result === undefined || result === null) {
          res.end();
        } else if (typeof result === 'string') {
          res.write(result);
        } else {
          res.json(result);
        }
      } catch (e) {
        next(e);
      }
    });
  });
}