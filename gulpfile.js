const gulp = require('gulp');
const babel = require('gulp-babel');
const apidoc = require('gulp-apidoc');
const uglify = require('gulp-uglify');
const pump = require('pump');
const clean = require('gulp-clean');
const pm2 = require('pm2');
const fs = require('fs');
const path = require('path');
const nodemon = require('gulp-nodemon');

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
  require('./config.project');
  develop('dev', PORT, PROJECT_NAME);
});
gulp.task('publish', ['doc'], () => {
  require('./config.project');
  publish('product', 3001 /* PORT */, PROJECT_NAME);
});

gulp.task('migration', () => {
  const migration = require('./bin/migration');
  // 处理命令行参数
  const argv = migration.getArgv(process.argv);
  // 设置环境变量
  process.env.NODE_ENV = argv.mode === 'dev' ? 'dev' : 'product';
  require('./config.project');
  // 操作数据库表
  migration.alterDatabase(argv);
});

gulp.task('default', ['dev']);