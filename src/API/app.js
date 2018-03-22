const express = require('express');
const app = express();
const server = require('http').createServer(app);
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const router = require('./router');
const ejs = require('ejs');

// 0.全局变量设置
global.$cfgs = require('./configs/loader');
global.$libs = require('./libs/loader');
global.$models = require('./models/loader');
global.$BLLs = require('./BLLs/loader');
global.$ws = require('../ws/websocket')(server);

const cfgs = global.$cfgs;
const libs = global.$libs;
const Hinter = libs.hinter;

// 1.设置express模板引擎
app.set('views', path.join(__dirname, 'templates', 'views'));
app.set('view engine', 'html');
app.engine('.html', ejs.__express);
ejs.delimiter = '$';
// 安全部分
app.use(helmet());

// 2.静态目录
app.use(express.static(path.join(__dirname, '../web/public')));
app.use(express.static('d:/website/blog.php/'));
// 3.解析请求
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// 国际化
app.use(libs.i18n);
// 文件处理中间件
app.use(libs.upload);
// 自动清理文件...日
//app.use(multerAutoReap);
// 4.全局变量
app.use(function (req, res, next) {
    res.locals.sys = cfgs.site.sys;
    next();
});

// 5.添加自定义响应方法(自动处理json:status与result)
app.use(libs.present({
    page: 'page',
    limit: 'limit',
    search: 'search',
    order: 'order',
    defaultLang: 'zh-cn',
    customDir: path.join(__dirname, 'templates/custom-errors'),
    validateDir: path.join(__dirname, 'templates/validate-errors')
}));
// 6.路由 含token验证
router(app);

// 7.error异常处理
app.use(function (err, req, res, next) {
    if (err instanceof Hinter) {
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
app.use(function (req, res) {
    //console.log(req.method);
    //console.log(req.originalUrl.length);
    //console.log(req.originalUrl);
    if (!res.headersSent) {
        res.status(404).render('404');
    }
});

process.on("uncaughtException", (err) => {
    console.error(err);
});
process.on("unhandledRejection", (reason) => {
    console.error(reason);
});


if (module.parent) {
    module.exports = app;
} else {
    // 监听端口，启动程序
    server.listen(cfgs.site.port, '0.0.0.0', function () {
        console.log(`图片站(API/web一体+ws) 监听端口:${cfgs.site.port}`);
    });
}