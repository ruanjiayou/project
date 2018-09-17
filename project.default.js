require('./config.default');
// 项目默认环境参数
define('PORT', '3000');
define('NODE_ENV', 'dev');

// 环境变量
if (process.env.PORT === undefined) {
  process.env.PORT = global.PORT;
} else {
  PORT = process.env.PORT;
}
if (process.env.NODE_ENV === undefined) {
  process.env.NODE_ENV = global.NODE_ENV;
} else {
  NODE_ENV = process.env.NODE_ENV;
}

// 项目单独参数
define('PROJECT_NAME', 'project');
define('UI_SITE', 'http://127.0.0.1:2017');

// 数据库
define('MYSQL_DEV', {
  USER: 'root',
  PASS: '',
  HOST: '127.0.0.1',
  PORT: '3306',
  DB: 'project-dev'
});
define('MYSQL_PRODUCT', {
  USER: 'root',
  PASS: '',
  HOST: '127.0.0.1',
  PORT: '3306',
  DB: 'project-product'
});
// 从数据库中拉取配置,定义全局常量
module.exports = async function (cb) {
  const models = require(MODEL_PATH + '/index');
  const configs = await models.Config.findAll();
  configs.forEach(function (item) {
    let v = item.value;
    item = item.toJSON();
    switch (item.type) {
      case 'int': v = parseInt(v); break;
      case 'string': break;
      default: v = JSON.parse(v); break;
    }
    console.log(v);
    define(item.name, v);
  });
  if (cb) {
    cb();
  }
};