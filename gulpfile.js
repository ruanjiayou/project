const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const clean = require('gulp-clean');
const apidoc = require('gulp-apidoc');
const shell = require('gulp-shell');
const pm2 = require('pm2');
const fs = require('fs');
const path = require('path');

const configs = require('./src/API/configs/loader');

gulp.task('cleanDist', () => {
  return gulp.src('./dist', { read: false })
    .pipe(clean());
});

gulp.task('doc', function (done) {
  apidoc({
    src: "src/routes",
    dest: "doc",
    debug: true,
  }, done);
});

gulp.task('dev', function(){
  const env = configs.env['dev'];
  var stream = nodemon({
    script: 'src/API/app.js',
    watch: ['src'],
    ext: "js json",
    tasks: ['dev'],
    delay: '2500',
    env: env
  });
  stream.on('restart', function () {
    console.log('restarted!');
  }).on('crash', function (err) {
    console.error(err);
    console.error('Application has crashed!\n');
    stream.emit('restart', 10);  // restart the server in 10 seconds
  }).on('exit', (code) => {
    // stream.emit('quit');
    // process.exit(code);
  });
});

gulp.task('test', ['doc'], function () {
  var pmList = function () {
    return new Promise((resolve, reject) => {
      pm2.list(function (err, list) {
        if (err) return reject(err);
        return resolve(list);
      });
    });
  };

  var pmDelete = function (pmId) {
    return new Promise(function (resolve, reject) {
      pm2.delete(pmId, function (err) {
        if (err) return reject(err);
        return resolve();
      });
    });
  };

  var pmStart = function () {
    const env = configs['test'];
    process.env.NODE_ENV = 'test'
    return new Promise(function (resolve, reject) {
      pm2.connect(function (err) {
        if (err) {
          if (err) return reject(err);
        }
        pm2.start({
          name: "project-api",
          script: './src/API/app.js',// Script to be run
          env: env,
        }, function (err, apps) {
          if (err) return reject(err);
          pm2.disconnect();   // Disconnects from PM2
          return resolve();
        });
      });
    });
  };

  return new Promise((resolve, reject) => {
    pmList().then(function (res) {
      const instance = res.find((item) => {
        return item.name === env.project;
      });
      if (instance) {
        return pmDelete(instance.pm_id);
      }
      return Promise.resolve();
    }).then(function (res) {
      return pmStart();
    }).then(function (res) {
      process.exit(2);
    }).catch(function (err) {
      console.error(err);
      process.exit(2);
    });
  });
});

gulp.task('production', function(){

});