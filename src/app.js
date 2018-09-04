const express = require('express');
const app = express();
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ejs = require('ejs');

// .设置express模板引擎
app.set('views', VIEW_PATH);
app.set('view engine', 'html');
app.engine('.html', ejs.__express);
ejs.delimiter = '$';

// .安全部分
app.use(helmet());

// .静态目录
app.use(express.static(STATIC_PATH));

// .解析请求
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// .国际化
app.use(require(LIB_PATH + '/i18nHelper'));

// .文件处理中间件
app.use(require(LIB_PATH + '/uploadHelper'));

// 自动清理文件...日
//app.use(multerAutoReap);

app.use(require(LIB_PATH + '/cors'));

// .全局变量
app.use(function (req, res, next) {
  //TODO:
  //res.locals.sys = {};
  next();
});

// .添加自定义响应方法(自动处理json:status与result).
const presenter = require(LIB_PATH + '/presenter');
app.use(presenter.presenter({
  page: REQ_PAGE,
  limit: REQ_LIMIT,
  search: REQ_SEARCH,
  order: REQ_ORDER,
}));

// .路由,含token验证
require('./router')(app);

// .error异常处理
app.use(function (err, req, res, next) {
  console.log(err);
  const result = presenter.preError(err);
  if (undefined === result) {
    next();
  } else {
    res.json(result);
  }
});

// .404路由
app.use(function (req, res) {
  // console.log(req.method);
  // console.log(req.originalUrl.length);
  // console.log(req.originalUrl);
  if (!res.headersSent) {
    if (/^\/v\d+/.test(req.originalUrl)) {
      res.status(404).send('API不存在!');
    } else {
      res.redirect('/404.html');
    }
  }
});

module.exports = app;