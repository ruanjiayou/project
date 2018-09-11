const express = require('express');
const app = express();
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
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

// .请求限制的处理
const uploadCfg = require(CONFIG_PATH + '/upload');
app.use(express.json({ limit: uploadCfg.limits.fileSize }));
app.use(compression());

// .解析请求
app.use(cookieParser());
app.use(bodyParser.json({ limit: uploadCfg.limits.fileSize }));
app.use(bodyParser.urlencoded({ limit: uploadCfg.limits.fileSize, extended: true }));

// .国际化
app.use(require(LIB_PATH + '/i18nHelper'));

// 自动清理文件...日
//app.use(multerAutoReap);

// .跨域处理
app.use(require(LIB_PATH + '/cors'));

// .form文件解析
app.use(require(LIB_PATH + '/fileParser'));

const storager = require(LIB_PATH + '/storager');
const presenter = require(LIB_PATH + '/presenter');
// .添加自定义方法
app.use(function (req, res, next) {
  // .上传文件
  req.upload = function (field, format) {
    storager.create(this.files, field, format);
  };

  // .请求与响应
  req.paging = presenter.paging;
  res.return = presenter.preReturn;
  res.paging = presenter.prePaging;
  res.error = presenter.preError;
  res.success = presenter.success;
  res.fail = presenter.fail;
  res.formatResponse = presenter.formatResponse;

  // .全局变量
  res.locals.sys = C_SYSTEM;

  next();
});

// .路由,含token验证
require('./router')(app);

// .error异常处理
app.use(function (err, req, res, next) {
  console.log(err);
  const result = res.error(err);
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