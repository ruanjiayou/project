const path = require('path');
const fs = require('fs');
const dir = path.join(__dirname, 'routes');

const routes = [];
function scanner(dirname, app) {
    fs.readdirSync(dirname).forEach((file) => {
        let fullname = path.join(dirname, file);
        let ext = path.extname(file);
        if (fs.existsSync(fullname) && fs.lstatSync(fullname).isDirectory()) {
            // 递归遍历目录
            scanner(fullname, app);
        } else if (fullname !== module.filename && ext.toLowerCase() === '.js') {
            // 路由小模块
            let route = require(fullname);
            Object.keys(route).forEach((key) => {
                // 转化为可以排序的对象
                const [method, path] = key.split(' ');
                //app[method](path, route[key]);
                const o = {
                    type: method,
                    path: path,
                    handle: route[key]
                };
                routes.push(o);
            });
        }
    });
}

module.exports = function (app) {
    scanner(dir, app);
    // 排序
    global.$libs.adjustor(routes);
    // 挂载到app上
    routes.forEach(function (route) {
        app[route.type](route.path, route.handle);
    });
};