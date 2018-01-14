/**
 * 登录验证(session/jwt_token等)
 */
/*
const cookieParser = require('cookie-parser');
const session = require('express-session');
const config = require('../config/database');
const MySQLStore = require('express-mysql-session')(session);

module.exports = function (app) {
    app.use(cookieParser(config.session.secret));
    app.use(session({
        key: config.session.key,//session_cookie_name 设置 cookie 中保存 session id 的字段名称
        secret: config.session.secret,//session_cookie_secret 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
        resave: true,// 强制更新 session
        saveUninitialized: true,// 设置为 false，强制创建一个 session，即使用户未登录
        cookie: {
            maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
        },
        store: new MySQLStore({
            host: config.host,
            port: config.port,
            user: config.username,
            password: config.password,
            database: config.database
        }),
    }));
};
*/

// 2017-12-14 20:41:37 jwt验证
// lib
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const authConfig = require('../configs/').auth;

/**
 * 采用sha1 + salt
 */
function encrypt(str) {
    const hmac = crypto.createHmac('sha1', authConfig.salt);
    hmac.update(str);
    return hmac.digest('hex');
}
/**
 * jwt数据加密
 * @param {object} data 载荷
 */
function encode(data) {
    const token = jwt.sign(data, authConfig.secret, { expiresIn: authConfig.exp });
    return ({
        type: authConfig.type,
        token: token
    });
}
/**
 * 有的header区分大小写,有的不区分
 * 返回Token json
 * 一定要catch这个函数
 */
function decode(req) {
    let key = authConfig.key.toLocaleLowerCase();
    let token = req.headers[key] || (req.body && req.body[key]) || (req.query && req.query[key]);
    if (token) {
        try {
            token = jwt.verify(token.split(' ')[1], authConfig.secret);
        } catch(err){
            throw new HinterError('auth', 'tokenExpired');
        }
    } else {
        throw new HinterError('auth', 'tokenNotFound');
    }
    return token;
};
module.exports = {
    encrypt,
    encode,
    decode
};