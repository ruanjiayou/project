process.env.port = process.env.port ? process.env.port : '3000';

global.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'dev';
// 项目路径
global.ROOT_PATH = __dirname + '/';
// 应用程序路径
global.APP_PATH = NODE_ENV === 'dev' ? ROOT_PATH + 'src/' : __dirname + '/';
// 配置路径
global.CONFIG_PATH = `${APP_PATH}/config/`;
// 库文件路径
global.LIB_PATH = `${APP_PATH}/lib/`;
// 路由路径
global.ROUTE_PATH = `${APP_PATH}/routes/`;
// 错误json路径
global.ERROR_PATH = `${APP_PATH}/templates/errors/`;
// 前端模板路径
global.VIEW_PATH = `${APP_PATH}/templates/views/`;
// 邮件模板路径
global.EMAIL_PATH = `${APP_PATH}/templates/emails/`;
// 插件路径
global.PLUGIN_PATH = `${APP_PATH}/plugin/`;
// 静态文件路径
global.STATIC_PATH = `${ROOT_PATH}/static/`;

// 请求字段
global.REQ_PAGE = 'page';
global.REQ_LIMIT = 'limit';
global.REQ_SEARCH = 'search';
global.REQ_ORDER = 'order';
// 返回字段
global.RES_SUCCESS = 'success';
global.RES_FAIL = 'fail';
global.RES_STATUS = 'state';
global.RES_DATA = 'rdata';
global.RES_CODE = 'ecode';
global.RES_ERROR = 'error';
// 分页
global.RES_PAGINATOR = 'paginator';
global.RES_PAGINATOR_PAGE = 'page';
global.RES_PAGINATOR_PAGES = 'pages';
global.RES_PAGINATOR_LIMIT = 'limit';
global.RES_PAGINATOR_COUNT = 'count';
global.RES_PAGINATOR_TOTAL = 'total';

process.on("uncaughtException", (err) => {
  console.error(err);
});
process.on("unhandledRejection", (reason) => {
  console.error(reason);
});

const server = require(APP_PATH + '/app.js');

server.listen(process.env.port, '0.0.0.0', () => {
  console.log(`项目已启动:端口(${process.env.port})`);
});