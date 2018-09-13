module.exports = {
  dev: {
    //数据库登录名
    username: MYSQL_DEV.USER,
    //数据库登录密码
    password: MYSQL_DEV.PASS,
    //数据库url地址
    host: MYSQL_DEV.HOST,
    //数据库url端口
    port: MYSQL_DEV.PORT,
    //数据库方言
    dialect: 'mysql',
    //数据库名
    database: MYSQL_DEV.DB,
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
  product: {
    //数据库登录名
    username: MYSQL_PRODUCT.USER,
    //数据库登录密码
    password: MYSQL_PRODUCT.PASS,
    //数据库url地址
    host: MYSQL_PRODUCT.HOST,
    //数据库url端口
    port: MYSQL_PRODUCT.PORT,
    //数据库方言
    dialect: 'mysql',
    //数据库名
    database: MYSQL_PRODUCT.DB,
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
  }
};