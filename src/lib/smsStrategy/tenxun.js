const ioHelper = require(LIB_PATH + '/ioHelper');
const shttp = require('net-helper').shttp;
const crypto = require('crypto');

class smsHelper {
  constructor(appid, appkey) {
    this.appid = appid;
    this.appkey = appkey;
  }
  /**
   * 计算签名, 传入手机号生成的是模板的sign,不然就是签名的sign
   * @param {string} [phone] 手机号
   */
  signature(phone = '') {
    const random = ioHelper.random(10, 'imix');
    const time = Math.round(new Date().getTime() / 1000);
    if (phone !== '') {
      phone = '&mobile=' + phone;
    }
    const sign = crypto.createHash('sha256').update(`appkey=${this.appkey}&random=${random}&time=${time}${phone}`).digest('hex');
    return { random, time, sign }
  }
  /**
   * 添加短信签名
   */
  static addSign() {
    const signature = smsHelper.signature();
    const result = shttp
      .post('https://yun.tim.qq.com/v5/tlssmssvr/add_sign')
      .query({
        'sdkappid': this.appid,
        'random': signature['random']
      })
      .send({
        'sig': signature['sign'],
        'time': signature['time']
      })
      .end();
    return result.body;
  }
  static getSign() {

  }
  static delSign() {

  }
  static addTpl() {

  }
  static getTpl() {

  }
  static delTpl() {

  }
  async send(info, params) {
    let signature = this.signature(info.phone);
    let result = await shttp
      .post(`https://yun.tim.qq.com/v5/tlssmssvr/sendsms`)
      .query({
        'sdkappid': this.appid,
        'random': signature['random']
      })
      .send({
        'ext': '',
        'extend': '',
        'params': params,
        'sig': signature['sign'],
        'sign': info['sign'],
        'tel': {
          'mobile': info['phone'],
          'nationcode': info['county'] ? info['county'] : '86'
        },
        'time': signature['time'],
        'tpl_id': info['tplId']
      })
      .end();
    return result.body;
  }
}
module.exports = smsHelper;