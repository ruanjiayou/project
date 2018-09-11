const _ = require('lodash');
const crypto = require('crypto');
const rp = require('request-promise');
const request = require('request');

// TODO: 5.获取二维码 6.统一下单 7.发送消息
class wxHelper {
  // this.updatedAt = null;
  // this.accessToken = null;
  /**
   * 获取授权
   * @param {string} appId 
   * @param {string} secret 
   */
  static async getAccessToken(appId, secret) {
    const timestamp = new Date().getTime();
    if (wxHelper.accessToken) {
      if (timestamp - wxHelper.updatedAt <= 7000000) {
        return wxHelper.accessToken;
      }
    }
    const str = await rp({
      url: 'https://api.weixin.qq.com/cgi-bin/token',
      qs: {
        grant_type: 'client_credential',
        appid: appId,
        secret
      },
      method: 'GET'
    });
    const res = JSON.parse(str);
    wxHelper.updatedAt = timestamp;
    wxHelper.accessToken = res.access_token;
    return res;
  }

  /**
   * 获取openid/unionid/sessionKey
   * @param {string} appid 
   * @param {string} secret 
   * @param {string} code 
   */
  static async getWxmInfo(appid, secret, code) {
    const wxmInfo = await rp({
      uri: `https://api.weixin.qq.com/sns/jscode2session?`,
      qs: {
        appid: appid,
        secret: secret,
        js_code: code,
        grant_type: 'authorization_code'
      },
      method: 'GET',
      json: true
    });
    return wxmInfo;
  }

  /**
   * 获取手机号
   * @param {string} sessionKey 
   * @param {string} encryptedData 加密数据
   * @param {string} iv 加密向量
   */
  static async getWxmPhone(appid, secret, code, encryptedData, iv) {
    const wxInfo = await wxHelper.getWxmInfo(appid, secret, code);
    if (wxInfo.errcode) {
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
   * 获取账号下的模板消息列表
   * @param {string} accessToken 
   * @param {int} page 
   * @param {int} offset 
   */
  static async getNotifyTpl(accessToken, page = 1, offset = 20) {
    const notifies = await rp({
      url: 'https://api.weixin.qq.com/cgi-bin/wxopen/template/list',
      qs: {
        access_token: accessToken,
        offset: page,
        count: offset
      },
      method: 'POST'
    });
    return notifies;
  }

  /**
   * 发送消息
   * @param {object} opt 
   * @param {array} dataArr 
   */
  static async sendNotifyTpl(opt, dataArr) {
    const tplData = {
      access_token: opt.accessToken,
      touser: opt.openid,
      template_id: opt.tplId,
      form_id: opt.formId,
      data: ''
    };
    // 2.keywords
    const keywords = {};
    dataArr.forEach((item, index) => {
      keywords[`keyword${index + 1}`] = { value: item, color: '#005397' };
    });
    tplData.data = keywords;
    let access_token = tplData.access_token;
    delete tplData.access_token;
    // 3.发送请求
    const res = await rp({
      url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send',
      qs: {
        access_token: access_token
      },
      body: tplData,
      json: true,
      method: 'POST'
    });
    return res;
  }

  /**
   * 获取小程序二维码
   */
  static async getWxMicroQrcode(appid, secret, input, type = 'url') {
    const accessToken = await wxHelper.getAccessToken(appid, secret);
    if (type === 'stream') {
      return request({
        method: 'POST',
        url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + accessToken,
        body: input,
        json: true
      });
    } else {
      const rs = await request({
        method: 'POST',
        url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + accessToken,
        body: input,
        json: true
      });
      if (type === 'stream') {
        return rs;
      }
      //生成随机文件名
      const filename = '/image/qr-' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx.png'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      }).toUpperCase();
      const fullpath = 'D:\\projects\\mall-template-ts\\static\\' + filename;
      await new Promise(function (resolve, reject) {
        // 文件流保存
        const ws = fs.createWriteStream(fullpath);
        ws.on('finish', function () {
          resolve(true);
        });
        rs.pipe(ws);
      });
      if (type === 'url') {
        return filename;
      } else {
        // 文件转base64
        let rawdata = fs.readFileSync(fullpath);
        rawdata = new Buffer(rawdata).toString('base64');
        const result = 'data:image/png;base64,' + rawdata;
        fs.unlink(fullpath);
        return result;
      }
    }
  }

  /**
   * 小程序统一下单
   * @param {string} key 
   * @param {object} opt 
   */
  static async getMicroPreOrder(key, opt) {
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