const express = require('express');
const Server = express();
const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const router = require('./router');
const ejs = require('ejs');
const cfgs = require('./configs/');
const libs = require('./libs/');

// 1.设置express模板引擎
Server.set('views', path.join(__dirname, 'template', 'views'));
Server.set('view engine', 'html');
Server.engine('.html', ejs.__express);
ejs.delimiter = '$';
// 安全部分
Server.use(helmet());

// 2.静态目录
Server.use(express.static(path.join(__dirname, './public')));
// 3.解析请求
Server.use(bodyParser.json());
Server.use(bodyParser.urlencoded({ extended: false }));
// 文件处理中间件
Server.use(libs.upload);
// 自动清理文件...日
//Server.use(multerAutoReap);
// 4.session验证
//auth(Server);
// 4.全局变量
Server.use(function (req, res, next) {
    res.locals.sys = cfgs.site.sys;
    next();
});

// 5.添加自定义响应方法(自动处理json:status与result)
Server.use(libs.present({
    page: 'page',
    limit: 'limit',
    search: 'search',
    order: 'order',
    errDir: path.join(__dirname, 'templates/errors')
}));
// 6.路由 含token验证
router(Server);
// 7.error异常处理
Server.use(function (err, req, res, next) {
    if (err instanceof HinterError) {
        res.errors(err);
    } else if (err) {
        res.status(500).send({ status: 'failed', message: `${err.message}` });
    } else {
        next();
    }
});
// 8.404
Server.use(function (req, res) {
    if (!res.headersSent) {
        res.status(404).render('404');
    }
});


if (module.parent) {
    module.exports = Server;
} else {
    // 监听端口，启动程序
    Server.listen(cfgs.site.port, '0.0.0.0', function () {
        console.log(`图片站后台API 监听端口:${cfgs.site.port}`);
    });
}