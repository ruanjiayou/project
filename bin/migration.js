/**
 * @author ruanjiayou
 * @description 刷新数据库
 * @time 2018-4-3 17:19:36
 */
const _ = require('lodash');
const fs = require('fs');
process.env.NODE_ENV = _.isNil(process.env.NODE_ENV) ? 'dev' : process.env.NODE_ENV;
const dir = process.env.NODE_ENV === 'dev' ? 'src' : 'dist';
const models = require(`../${dir}/models/index`);

const alterDatabase = async (argv) => {
  argv = getArgv(argv);
  console.log('刷表前请确定已编译ts文件!');
  try {
    if (argv.force === true) {
      await models.sequelize.sync({ force: true });
      // // 权限
      // await models.AdminMenu.seed();
      // // 角色
      // await models.AdminRole.seed();
      // // 角色的权限
      // await models.AdminRoleMenuMap.seed();
      // // 管理员
      // await models.Admin.seed();
      // // 管理员的角色
      // await models.AdminRoleMap.seed();

      // await models.Admin.seed();
      // await models.Auth.seed();
      // await models.AdminAuth.seed();
      await models.User.seed();
    } else {
      await models.sequelize.sync();
    }
    console.log('数据库表已修改成功!');
    process.exit();
  } catch (err) {
    console.log(err, '创建出错!');
  }
}
/**
 * 获取命令行参数
 * -F/--force 删除表 -D/--dev 本地开发模式 -T/--test 测试环境开发模式 -P/--production 线上模式
 * @returns {object} { mode: 'dev/test/production', force: true/false }
 */
function getArgv(argv) {
  const res = {};
  if (_.isNil(argv)) {
    argv = process.argv;
  }
  argv.forEach(item => {
    if (fs.existsSync(item)) {
      return;
    }
    if (item.charAt(0) === '-') {
      switch (item.charAt(1)) {
        case '-':
          switch (item) {
            case 'dev':
              res.mode = 'dev';
              break;
            case 'force':
              res.force = true;
              break;
            case 'test':
              res.mode = 'test';
              break;
            case 'production':
              res.mode = 'production';
              break;
            default: break;
          }
          res[item.substring(1)] = true;
          break;
        default:
          switch (item.substring(1)) {
            case 'D':
              res.mode = 'dev';
              break;
            case 'F':
              res.force = true;
              break;
            case 'T':
              res.mode = 'test';
              break;
            case 'P':
              res.mode = 'production';
              break;
            default: break;
          }
          break;
      }
    }
  });
  return res;
}
module.exports = alterDatabase;