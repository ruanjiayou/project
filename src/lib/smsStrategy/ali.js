const _ = require('lodash');
const SMSClient = require('@alicloud/sms-sdk');

class smsHelper {
  constructor(appid, appkey) {
    this.accessKeyId = appid;
    this.secretAccessKey = appkey;
    this.smsClient = new SMSClient({ accessKeyId: this.accessKeyId, secretAccessKey: this.secretAccessKey });
  }

  send(info, params) {
    return this.smsClient.sendSMS({
      PhoneNumbers: info.phone,
      SignName: info.sign,
      TemplateCode: info.tplId,
      TemplateParam: JSON.stringify(params)
    });
  }
}

module.exports = smsHelper;