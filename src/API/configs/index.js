const config = {
    auth: {
        key: 'Authorization',
        type: 'JWT',
        alg: 'HS256',
        exp: 7 * 24 * 60 * 60,
        secret: 'qiaoliting',
        salt: '89757'
    },
    cache: {},
    database: {
        //数据库登录名
        username: 'root',
        //数据库登录密码
        password: '',
        //数据库url地址
        host: 'localhost',
        //数据库url端口
        port: '3306',
        //数据库方言
        dialect: 'mysql',
        //数据库名
        database: 'images',
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
    email: {
        secure: true,// 使用SSL
        secureConnection: true,// 使用SSL
        host: 'smtp.qq.com',
        port: 465,// SMTP端口
        auth: {
            user: '1439120442@qq.com',
            pass: 'jfvfiwoxeelcgich'// 授权码
        }
    },
    upload: {
        dest: '../.tmp',
        limits: {
            fieldNameSize: 100,
            fileSize: 1024 * 1024 * 1024,
            fields: 100
        }
    },
    i18n: {},
    image: {
        localPath: 'D:/WebSite/blog.php',
        rootPath: '/ueditor/php/upload/image/',
        
    },
    log: {
        // 日志持久化方案: debug console null redis 异步文件 同步文件 邮件...
        type: 'fileSync',
        // 存储的位置(相对app.js文件)
        filename: '../logs/info.txt',
        level: 'info'
    },
    queue: {
        redis: {
            prefix: 'q',
            host: '127.0.0.1',
            port: 6379
        }
    },
    site: {
        apiPath: '',
        sys: {
            name: 'blog',
            email: '1439120442@qq.com',
            team: '',
            title: ''
        },
        port: '8098',
        apiBaseUrl: '',
        baseUrl: ''
    },
    sms: {}
};

module.exports = config;