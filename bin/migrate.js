/**
 * @author ruanjiayou
 * @description 刷新数据库
 * @time 2017-12-3 19:04:19
 */
global.$cfgs = require('../src/API/configs/loader');
global.$libs = require('../src/API/libs/loader');
global.$models = require('../src/API/models/loader');
// 1.加载model
const models = global.$models;

async function create() {
    await models.sequelize.sync({ force: true });
    //await models.sequelize.sync();
    // 因为有顺序要求
    await models.User.initialize();
    await models.Image.initialize();
}
create().then(function () {
    console.log('数据库表已全部创建成功!');
    process.exit();
}).catch(function (err) {
    console.log(err.message);
});