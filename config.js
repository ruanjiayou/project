global.define = function (key, value) {
  global[key] = value;
};
// 约定目录
// 项目路径
define('ROOT_PATH', __dirname);
// 应用程序路径,固定写src,想根据NODE_ENV改也可以
define('APP_PATH', `${ROOT_PATH}/src`);
// 配置路径
define('CONFIG_PATH', `${APP_PATH}/config`);
// 库文件路径
define('LIB_PATH', `${APP_PATH}/lib`);
// models文件路径
define('MODEL_PATH', `${APP_PATH}/models`);
// BLL文件路径
define('BLL_PATH', `${APP_PATH}/BLL`);
// 路由路径
define('ROUTE_PATH', `${APP_PATH}/routes`);
// 错误json路径
define('ERROR_PATH', `${APP_PATH}/templates/errors`);
// 前端模板路径
define('VIEW_PATH', `${APP_PATH}/templates/views`);
// 邮件模板路径
define('EMAIL_PATH', `${APP_PATH}/templates/emails`);
// 插件路径
define('PLUGIN_PATH', `${APP_PATH}/plugin`);
// 静态文件路径
define('STATIC_PATH', `${ROOT_PATH}/static`);

// 端口和环境: 环境由命令行确定,端口这里配置
define('PORT', 3000);
define('NODE_ENV', process.env.NODE_ENV);

define('PROJECT_NAME', 'test');

// 约定名称
// 请求约定字段
define('REQ_PAGE', 'page');
define('REQ_LIMIT', 'limit');
define('REQ_SEARCH', 'search');
define('REQ_ORDER', 'order');
// 约定返回字段
define('RES_SUCCESS', 'success');
define('RES_FAIL', 'fail');
define('RES_STATUS', 'state');
define('RES_DATA', 'rdata');
define('RES_CODE', 'ecode');
define('RES_ERROR', 'error');
// 约定分页字段
define('RES_PAGER', 'pager');
define('RES_PAGER_PAGE', 'page');
define('RES_PAGER_PAGES', 'pages');
define('RES_PAGER_LIMIT', 'limit');
define('RES_PAGER_COUNT', 'count');
define('RES_PAGER_TOTAL', 'total');
// 默认后缀
define('DEFAULT_INDEX', ['.html']);

// 支持的api版本
define('VERSION', ['v1']);

// 数据库
define('MYSQL_DEV', {
  USER: 'root',
  PASS: '',
  HOST: '127.0.0.1',
  PORT: '3306',
  DB: 'project_test'
});
define('MYSQL_PRODUCT', {
  USER: 'root',
  PASS: '',
  HOST: '127.0.0.1',
  PORT: '3306',
  DB: 'project_test'
});
