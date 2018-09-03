const cfg = require('./config.project');
const server = require(APP_PATH + '/app.js');

process.on("uncaughtException", (err) => {
  console.error(err);
});
process.on("unhandledRejection", (reason) => {
  console.error(reason);
});

cfg(function () {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`项目已启动:端口(${PORT})`);
  });
});