const gulp = require('gulp');
const babel = require('gulp-babel');
const apidoc = require('gulp-apidoc');
const uglify = require('gulp-uglify');
const pump = require('pump');
const clean = require('gulp-clean');
const pm2 = require('pm2');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const nodemon = require('gulp-nodemon');
require('./config');

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
async function alterDatabase(argv) {
  const models = require(`${MODEL_PATH}/index`);
  console.log('刷表前请确定已编译ts文件!');
  try {
    await models.Config.sync({ force: false });
    if (argv.force === true) {
      //await models.sequelize.sync({ force: true });
      for (let k in models) {
        if (k !== 'Op' && k !== 'sequelize' && k !== 'Config') {
          await models[k].sync({ force: true });
        }
      }
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
    console.log(argv, '参数列表');
    console.log(err, '创建出错!');
  }
}

/**
 * 清空生成的dist目录
 */
gulp.task('clean', () => {
  const dir = path.normalize(`${__dirname}/dist/`);
  const arr = [];
  const files = fs.readdirSync(dir);
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fullpath = path.join(dir, file);
    if (fs.existsSync(fullpath) && fs.lstatSync(fullpath).isDirectory()) {
      arr.push(fullpath);
    } else {
      fs.unlinkSync(fullpath);
    }
  }
  gulp.src(arr).pipe(clean());
});

/**
 * 生成api文档
 */
gulp.task('doc', (done) => {
  apidoc({ src: 'src/routes', dest: 'static/doc', debug: false }, done);
});

/**
 * 生成代码
 */
gulp.task('dist', async (cb) => {
  await gulp
    .src('./src/**/*.html')
    .pipe(gulp.dest('./dist'));
  pump([
    gulp.src('./src/**/*.js'),
    babel(),
    uglify(),
    gulp.dest('./dist')
  ]);
});

function develop(mode, port, project_name) {
  const stream = nodemon({
    script: 'launch.js',
    watch: ['src', 'launch.js', 'gulpfile.js'],
    ext: 'js json',
    delay: 3000,
    env: {
      NODE_ENV: mode,
      PORT: port,
    }
  });
  stream
    .on('restart', () => {
      console.log('重启中...');
    })
    .on('crash', (err) => {
      console.log(err);
      console.log('启动失败');
      stream.emit('restart', 10);
    })
    .on('exit', () => {
      //process.exit(0);
    })
}

async function publish(mode, port, project_name) {
  // pm2项目列表
  const projects = await new Promise((resolve, reject) => {
    pm2.list(function (err, list) {
      if (err) {
        reject(err);
      } else {
        resolve(list);
      }
    });
  });
  // 查找实例是否启动
  const instance = projects.find(item => {
    return item.name === project_name;
  });
  // 删除
  if (instance) {
    await new Promise((resolve, reject) => {
      pm2.delete(instance.pm_id, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  // 再启动
  const result = await new Promise((resolve, reject) => {
    pm2.connect(err => {
      if (err) {
        return reject(err);
      }
      pm2.start({
        name: project_name,
        script: './launch.js',
        env: {
          PORT: port,
          NODE_ENV: mode
        }
      }, function (err, apps) {
        if (err) {
          return reject(err);
        }
        pm2.disconnect();
        return resolve();
      });
    });
  });
  process.exit(2);
}

/**
 * 启动项目
 */
gulp.task('dev', () => {
  develop('dev', PORT, PROJECT_NAME);
});
gulp.task('publish', ['doc'], () => {
  publish('product', PORT, PROJECT_NAME);
});

gulp.task('migration', () => {
  // 处理命令行参数
  const argv = getArgv(process.argv);
  // 设置环境变量
  process.env.NODE_ENV = argv.mode === 'dev' ? 'dev' : 'product';
  global.NODE_ENV = process.env.NODE_ENV;
  // 操作数据库表
  alterDatabase(argv);
});

gulp.task('default', ['dev']);