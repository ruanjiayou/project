const _ = require('lodash');
const fs = require('fs');
const crypto = require('crypto');
const rp = require('request-promise');
const request = require('request');

// TODO: 6.统一下单
class wxHelper {
  constructor(wxAppId, wxSecret) {
    this.wxAppId = wxAppId;
    this.wxSecret = wxSecret;
    this.updatedAt = null;
    this.accessToken = null;
  }
  /**
   * 获取授权
   */
  async getAccessToken() {
    const timestamp = new Date().getTime();
    if (this.accessToken) {
      if (timestamp - this.updatedAt <= 7000000) {
        return this.accessToken;
      }
    }
    const str = await rp({
      url: 'https://api.weixin.qq.com/cgi-bin/token',
      qs: {
        grant_type: 'client_credential',
        appid: this.wxAppId,
        secret: this.wxSecret
      },
      method: 'GET'
    });
    const res = JSON.parse(str);
    this.updatedAt = timestamp;
    this.accessToken = res.access_token;
    return this.accessToken;
  }

  /**
   * 获取openid/unionid/sessionKey
   * @param {string} code 
   */
  async getWxmAccount(code) {
    const wxmInfo = await rp({
      uri: `https://api.weixin.qq.com/sns/jscode2session?`,
      qs: {
        appid: this.wxAppId,
        secret: this.wxSecret,
        js_code: code,
        grant_type: 'authorization_code'
      },
      method: 'GET',
      json: true
    });
    return wxmInfo;
  }

  /**
   * 获取用户信息,2018-9-13 23:21:28 现在不需要授权了
   */
  async getWxmUserInfo() {

  }
  /**
   * 获取手机号/昵称和头像
   * @param {string} sessionKey 
   * @param {string} encryptedData 加密数据
   * @param {string} iv 加密向量
   */
  async getWxmPhone(code, encryptedData, iv) {
    const wxInfo = await this.getWxmAccount(code);
    console.log(wxInfo);
    if (!wxInfo || wxInfo.errcode) {
      return wxInfo;
    }
    const sessionKeyBuf = new Buffer(wxInfo.session_key, "base64");
    const encryptedDataBuf = new Buffer(encryptedData, "base64");
    const ivBuf = new Buffer(iv, "base64");
    let decoded = '';
    // 解密
    const decipher = crypto.createDecipheriv("aes-128-cbc", sessionKeyBuf, ivBuf);
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true);
    decoded = decipher.update(encryptedDataBuf, "binary", "utf8");
    decoded += decipher.final("utf8");
    decoded = JSON.parse(decoded);
    return decoded;
  }

  /**
   * 生成小程序二维码
   * @param {object} input
   * @return {stream}
   */
  async getWxmQrcode(input) {
    const accessToken = await this.getAccessToken();
    return await request({
      method: 'POST',
      url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + accessToken,
      body: input,
      json: true
    });
  }
  /**
   * 获取账号下的模板消息列表
   * @param {int} page 
   * @param {int} offset 
   */
  async getNotifyTpl(page = 1, offset = 20) {
    const accessToken = await this.getAccessToken();
    const notifies = await rp({
      url: 'https://api.weixin.qq.com/cgi-bin/wxopen/template/list',
      qs: {
        access_token: accessToken,
      },
      body: {
        offset: (page - 1) * offset,
        count: offset
      },
      json: true,
      method: 'POST'
    });
    return notifies;
  }

  /**
   * 发送模板消息
   * @param {string} openid 
   * @param {string} tplId 
   * @param {string} formId 
   * @param {array} dataArr 
   */
  async sendNotifyTpl(openid, tplId, formId, dataArr) {
    const accessToken = await this.getAccessToken();
    const tplData = {
      touser: openid,
      template_id: tplId,
      form_id: formId,
      data: ''
    };
    // 2.keywords
    const keywords = {};
    dataArr.forEach((item, index) => {
      keywords[`keyword${index + 1}`] = { value: item, color: '#005397' };
    });
    tplData.data = keywords;
    // 3.发送请求
    const res = await rp({
      url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send',
      qs: {
        access_token: accessToken
      },
      body: tplData,
      json: true,
      method: 'POST'
    });
    return res;
  }

  /**
   * 小程序统一下单
   * @param {string} key 
   * @param {object} opt appid/openid/mch_id/body/out_trade_no/spbill_create_ip
   */
  async getMicroPreOrder(key, opt) {
    opt.appid = this.wxAppId;
    return wxPayHelper.getPayOpt(key, opt);
  }

}
// 小程序支付
class wxPayHelper {

  /**
   * 生成sign
   * @param key 商户key
   * @param opt object
   */
  static _getSign(key, opt) {
    const keyArr = [];
    // 去掉空的字段
    for (let k in opt) {
      if (!_.isNil(opt[k])) {
        keyArr.push([k, opt[k]])
      }
    }
    // 按ASCII排序
    keyArr.sort(function (a, b) {
      return wxPayHelper._compare(a[0], b[0]);
    });
    // 生成stringA
    const stringA = (keyArr.map((t) => { return t.join('=') })).join('&');
    // 生成stringSignTemp
    const stringSignTemp = `${stringA}&key=${key}`;
    // 生成sign
    const sign = crypto.createHash('md5').update(stringSignTemp).digest('hex').toUpperCase();
    return sign;
  }
  /**
   * 生成 微信支付的xml(ASCII排序..)
   * @param opt object
   */
  static _json2TXxml(opt) {
    const keyArr = [];
    // 去掉空的字段
    for (let k in opt) {
      if (!_.isNil(opt[k])) {
        keyArr.push([k, opt[k]])
      }
    }
    // 按ASCII排序
    keyArr.sort(function (a, b) {
      return wxPayHelper._compare(a[0], b[0]);
    });
    let xml = '<xml>';
    keyArr.forEach((item) => {
      xml += `\n  <${item[0]}>${item[1]}</${item[0]}>`
    });
    xml += '\n</xml>';
    return xml;
  }
  /**
   * 生成32位随机字符串
   */
  static _get32RandStr() {
    return crypto.createHash('md5').update(`${new Date().getTime()}-${Math.floor(Math.random() * 10000)}`).digest('hex');
  }
  /**
   * 比较字符串大小,类C
   * @param str1 
   * @param str2 
   */
  static _compare(str1, str2) {
    let len1 = str1.length, len2 = str2.length;
    for (let i = 0; i < len1 && i < len2; i++) {
      if (str1.charCodeAt(i) !== str2.charCodeAt(i)) {
        return str1.charCodeAt(i) - str2.charCodeAt(i);
      }
    }
    return len1 - len2;
  }
  /**
   * 给前端小程序用的,发起支付请求
   * @param appid 
   * @param key 
   * @param prepay_id 
   */
  static getPayOpt(appid, key, prepay_id) {
    const opt = {
      appId: appid,
      timeStamp: Math.ceil(new Date().getTime() / 1000),
      nonceStr: wxPayHelper._get32RandStr(),
      package: `prepay_id=${prepay_id}`,
      signType: 'MD5'
    }
    opt.paySign = wxPayHelper._getSign(key, opt);
    delete opt.appId;
    return opt;
  }
}

module.exports = wxHelper;