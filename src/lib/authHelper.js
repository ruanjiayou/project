const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Hinter = require('./Hinter');

const authCfg = require(CONFIG_PATH + 'auth');

/**
 * 采用sha1 + salt
 */
function encrypt(str) {
  const hmac = crypto.createHmac('sha1', authCfg.salt);
  hmac.update(str);
  return hmac.digest('hex');
}

/**
 * jwt数据加密
 * @param {object} data 载荷
 */
function encode(data) {
  const token = jwt.sign(data, authCfg.secret, { expiresIn: authCfg.exp });
  return ({
    type: authCfg.type,
    token: token
  });
}


/**
 * 有的header区分大小写,有的不区分
 * 返回Token json
 * 一定要catch这个函数
 */
function decode(req) {
  let key = authCfg.key.toLocaleLowerCase();
  let token = req.headers[key] || (req.body && req.body[key]) || (req.query && req.query[key]);
  if (token) {
    try {
      token = jwt.verify(token, authCfg.secret);
    } catch (err) {
      throw new Hinter('auth', 'tokenExpired');
    }
  } else {
    throw new Hinter('auth', 'tokenNotFound');
  }
  return token;
};

module.exports = {
  encrypt,
  encode,
  decode
};