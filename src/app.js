const express = require('express');
const app = express();
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// .设置express模板引擎
// app.set('views', path.join(__dirname, 'templates', 'views'));
// app.set('view engine', 'html');
// app.engine('.html', ejs.__express);
// ejs.delimiter = '$';

// .安全部分
app.use(helmet());

// .静态目录
app.use(express.static(STATIC_PATH));

// .解析请求
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// .国际化
app.use(require(LIB_PATH + 'i18nHelper'));

// .文件处理中间件
app.use(require(LIB_PATH + 'uploadHelper'));

// 自动清理文件...日
//app.use(multerAutoReap);

// .全局变量
app.use(function (req, res, next) {
  //TODO:
  //res.locals.sys = {};
  next();
});

// .添加自定义响应方法(自动处理json:status与result).
const presenter = require(LIB_PATH + 'presenter');
app.use(presenter({
  page: REQ_PAGE,
  limit: REQ_LIMIT,
  search: REQ_SEARCH,
  order: REQ_ORDER,
}));

// .路由,含token验证
require('./router')(app);

// .error异常处理
const Hinter = require(LIB_PATH + 'Hinter');
app.use(function (err, req, res, next) {
  if (err instanceof Hinter) {
    // 自定义错误
    res.customError(err);
  } else if (err.validate) {
    // 验证错误
    res.validateError(err.validate);
  }
  else if (err) {
    const result = {};
    result[RES_STATUS] = RES_FAIL;
    result[RES_ERROR] = `${err.message}`;
    res.status(500).json(result);
  } else {
    next();
  }
});

// .404路由
app.use(function (req, res) {
  //console.log(req.method);
  //console.log(req.originalUrl.length);
  //console.log(req.originalUrl);
  if (!res.headersSent) {
    res.status(404).send('API不存在!');
  }
});

module.exports = app;