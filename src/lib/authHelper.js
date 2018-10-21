const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Hinter = require('./Hinter');

class AuthHelper {
  constructor(authCfg) {
    this.config = authCfg;
  }
  /**
   * 采用sha1 + salt
   */
  encrypt(str) {
    const hmac = crypto.createHmac('sha1', this.config.salt);
    hmac.update(str);
    return hmac.digest('hex');
  }

  /**
   * jwt数据加密
   * @param {object} data 载荷
   */
  encode(data) {
    const token = jwt.sign(data, this.config.secret, { expiresIn: this.config.exp });
    return ({
      type: this.config.type,
      token: token
    });
  }

  /**
   * 有的header区分大小写,有的不区分
   * 返回Token json
   * 一定要catch这个函数
   */
  decode(req) {
    let key = this.config.key.toLocaleLowerCase();
    let token = req.headers[key] || req.cookies[key] || (req.query && req.query[key]) || (req.body && req.body[key]);
    if (token) {
      try {
        token = jwt.verify(token, this.config.secret);
      } catch (err) {
        throw new Hinter('auth', 'tokenExpired');
      }
    } else {
      throw new Hinter('auth', 'tokenNotFound');
    }
    return token;
  }
}

module.exports = AuthHelper;