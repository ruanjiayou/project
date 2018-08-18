const gulp = require('gulp');
const apidoc = require('gulp-apidoc');
const uglify = require('gulp-uglify');
const pump = require('pump');
const clean = require('gulp-clean');
//const pm2 = require('pm2');
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
  apidoc({ src: 'src/routes', dest: 'public/doc', debug: false }, done);
});

/**
 * 生成代码
 */
gulp.task('dist', async () => {
  pump([
    gulp.src('src'),
    uglify(),
    gulp.dest('dist')
  ])
});

function develop(mode) {
  const stream = nodemon({
    script: 'launch.js',
    watch: ['src', 'launch.js', 'gulpfile.js'],
    ext: 'js json',
    delay: 3000,
    env: {
      NODE_ENV: mode
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
async function publish(mode) {
  //TODO:
  const pmList = pm2.list();
}
/**
 * 启动项目
 */
gulp.task('develop', () => {
  develop('dev');
});
gulp.task('publish', () => {

});

gulp.task('default', ['develop']);