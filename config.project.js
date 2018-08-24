// 项目环境参数,每个项目改这里或者从gulp中传过来
global.PORT = '8096';
global.NODE_ENV = 'dev';

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

require('./config.default');

// 项目单独参数
define('PROJECT_NAME', 'project');
// 可在此处覆盖PORT或default文件文件的配置

// 鉴权
define('AUTH_KEY', 'token');  // 鉴权字段
define('AUTH_SECRET', '');    // 鉴权密匙
define('AUTH_SALT', '');      // 鉴权随机盐
define('AUTH_EXP', 24 * 3600);// 鉴权有效期

// 数据库
define('MYSQL_DEV_USER', 'root');
define('MYSQL_DEV_PASS', '');
define('MYSQL_DEV_HOST', '127.0.0.1');
define('MYSQL_DEV_PORT', '3306');
define('MYSQL_DEV_DB', 'test');

define('MYSQL_PRODUCT_USER', 'root');
define('MYSQL_PRODUCT_PASS', '');
define('MYSQL_PRODUCT_HOST', '127.0.0.1');
define('MYSQL_PRODUCT_PORT', '3306');
define('MYSQL_PRODUCT_DB', 'test');

// email
define('EMAIL_HOST', 'smtp.qq.com');
define('EMAIL_PORT', 465);
define('EMAIL_AUTH_USER', '1439120442@qq.com');// 账号
define('EMAIL_AUTH_PASS', '');// 授权码

// i18n

// queue

// sms
define('SMS_APPID', '');
define('SMS_APPKEY', '');