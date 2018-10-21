require('./config');

process.on("uncaughtException", (err) => {
  console.error(err);
});
process.on("unhandledRejection", (reason) => {
  console.error(reason);
});

// 从数据库中拉取配置,定义全局常量
(async () => {
  let configs = [];
  try {
    const models = require(MODEL_PATH + '/index');
    configs = await models.Config.findAll();
  } catch (e) {
    console.log('连接数据库失败,继续启动!');
    console.log(e);
  }
  configs.forEach(function (item) {
    let v = item.value;
    item = item.toJSON();
    switch (item.type) {
      case 'int': v = parseInt(v); break;
      case 'string': break;
      default: v = JSON.parse(v); break;
    }
    if (global[item.name] !== undefined) {
      console.log(`全局属性覆盖: ${item.name}!`);
    }
    define(item.name, v);
  });
  const server = require(APP_PATH + '/app.js');
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`项目已启动:端口(${PORT})`);
  });
})();
