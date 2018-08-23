global.define = function (key, value) {
  global[key] = value;
};
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

// 项目路径
define('ROOT_PATH', __dirname);
// 应用程序路径
define('APP_PATH', NODE_ENV === 'dev' ? `${ROOT_PATH}/src` : `${ROOT_PATH}/dist`);
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

// 请求字段
define('REQ_PAGE', 'page');
define('REQ_LIMIT', 'limit');
define('REQ_SEARCH', 'search');
define('REQ_ORDER', 'order');
// 返回字段
define('RES_SUCCESS', 'success');
define('RES_FAIL', 'fail');
define('RES_STATUS', 'state');
define('RES_DATA', 'rdata');
define('RES_CODE', 'ecode');
define('RES_ERROR', 'error');
// 分页
define('RES_PAGINATOR', 'paginator');
define('RES_PAGINATOR_PAGE', 'page');
define('RES_PAGINATOR_PAGES', 'pages');
define('RES_PAGINATOR_LIMIT', 'limit');
define('RES_PAGINATOR_COUNT', 'count');
define('RES_PAGINATOR_TOTAL', 'total');
