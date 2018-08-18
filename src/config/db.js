module.exports = {
  dev: {
    //数据库登录名
    username: 'root',
    //数据库登录密码
    password: '',
    //数据库url地址
    host: '127.0.0.1',
    //数据库url端口
    port: '3306',
    //数据库方言
    dialect: 'mysql',
    //数据库名
    database: 'project_template',
    //database: 'images',
    session: {
      secret: 'session_cookie_name',
      key: 'session_cookie_secret',
      maxAge: 2592000000
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    timezone: '+08:00'
  },
  test: {

  },
  online: {

  }
};