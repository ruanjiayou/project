const aliSMS = require('./smsStrategy/ali');
const tenxumSMS = require('./smsStrategy/tenxun');

// TODO: 签名/模板/修改同步/占位符place/发送记录
class smsHelper {
  send(info, params) {
    switch (C_SMS_TYPE) {
      case 'tenxun':
        tenxumSMS.send(info, params);
        break;
      case 'ali':
        aliSMS.send(info, params);
        break;
      default: break;
    }
  }
  async sendMass() {

  }
}

module.exports = smsHelper;