require('./config.project');

process.on("uncaughtException", (err) => {
  console.error(err);
});
process.on("unhandledRejection", (reason) => {
  console.error(reason);
});

const server = require(APP_PATH + '/app.js');

server.listen(PORT, '0.0.0.0', () => {
  console.log(`项目已启动:端口(${PORT})`);
});