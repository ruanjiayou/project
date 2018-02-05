// 0.全局变量设置
global.$cfgs = require('./configs/loader');
global.$libs = require('./libs/loader');
global.$models = require('./models/loader');
global.$BLLs = require('./BLLs/loader');

const express = require('express');
const Server = express();
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const router = require('./router');
const ejs = require('ejs');
const cfgs = global.$cfgs;
const libs = global.$libs;

// 1.设置express模板引擎
Server.set('views', path.join(__dirname, 'templates', 'views'));
Server.set('view engine', 'html');
Server.engine('.html', ejs.__express);
ejs.delimiter = '$';
// 安全部分
Server.use(helmet());

// 2.静态目录
Server.use(express.static(path.join(__dirname, '../web/public')));
Server.use(express.static('d:/website/blog.php/'));
// 3.解析请求
Server.use(cookieParser());
Server.use(bodyParser.json());
Server.use(bodyParser.urlencoded({ extended: false }));
// 国际化
Server.use(libs.i18n);
// 文件处理中间件
Server.use(libs.upload);
// 自动清理文件...日
//Server.use(multerAutoReap);
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
    defaultLang: 'zh-cn',
    customDir: path.join(__dirname, 'templates/custom-errors'),
    validateDir: path.join(__dirname, 'templates/validate-errors')
}));
// 6.路由 含token验证
router(Server);

// 7.error异常处理
Server.use(function (err, req, res, next) {
    if (err instanceof HinterError) {
        // 自定义错误
        res.customError(err);
    } else if (err.validate) {
        // 验证错误
        res.validateError(err.validate);
    }
    else if (err) {
        res.status(500).send({ status: 'false', message: `${err.message}` });
    } else {
        next();
    }
});
// 8.404
Server.use(function (req, res) {
    //console.log(req.method);
    //console.log(req.originalUrl.length);
    //console.log(req.originalUrl);
    if (!res.headersSent) {
        res.status(404).render('404');
    }
});


if (module.parent) {
    module.exports = Server;
} else {
    // 监听端口，启动程序
    Server.listen(cfgs.site.port, '0.0.0.0', function () {
        console.log(`图片站(API/web一体) 监听端口:${cfgs.site.port}`);
    });
}