module.exports = {
  dev: {
    //数据库登录名
    username: MYSQL_DEV_USER,
    //数据库登录密码
    password: MYSQL_DEV_PASS,
    //数据库url地址
    host: MYSQL_DEV_HOST,
    //数据库url端口
    port: MYSQL_DEV_PORT,
    //数据库方言
    dialect: 'mysql',
    //数据库名
    database: MYSQL_DEV_DB,
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
    username: MYSQL_PRODUCT_USER,
    //数据库登录密码
    password: MYSQL_PRODUCT_PASS,
    //数据库url地址
    host: MYSQL_PRODUCT_HOST,
    //数据库url端口
    port: MYSQL_PRODUCT_PORT,
    //数据库方言
    dialect: 'mysql',
    //数据库名
    database: MYSQL_PRODUCT_DB,
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