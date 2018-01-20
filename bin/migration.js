/**
 * @author ruanjiayou
 * @description 刷新数据库
 * @time 2017-12-3 19:04:19
 */
// 1.加载model
const models = require('../src/API/models');

async function create() {
    await models.sequelize.sync({ force: true });
    //await models.sequelize.sync();
    for (let k in models) {
        if (typeof models[k].associate === 'function') {
            //MYISAM 不支持外键
            await models[k].associate(models);
        }
        // if (typeof models[k].initialize === 'function') {
        //     await models[k].initialize();
        // }
    };
    await models.User.initialize();
    await models.Image.initialize();
}
create().then(function () {
    console.log('数据库表已全部创建成功!');
    process.exit();
}).catch(function (err) {
    console.log(err.message);
});