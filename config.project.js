require('./config.default');
// 项目单独参数
define('PROJECT_NAME', 'project');

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
define('MYSQL_DEV_DB', '3306');

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