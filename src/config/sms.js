const SMS = C_SMS_TYPE === 'tenxun' ? SMS_TX : SMS_ALI;
module.exports = {
  appId: SMS.APPID,
  appKey: SMS.APPKEY
};