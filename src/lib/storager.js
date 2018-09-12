const localStorage = require('./storageStrategy/local');
const aliStorage = require('./storageStrategy/ali');
const tenxunStorage = require('./storageStrategy/tenxun');

class Storager {
  static async create(files, format) {
    switch (C_UPLOAD_TYPE) {
      case 'tenxun':
        return await new tenxunStorage(C_COS_TX_APPID, C_COS_TX_SECRETID, C_COS_TX_SECRETKEY, C_COS_TX_REGION, C_COS_TX_BUCKET).create(files, format);
      case 'ali':
        return await new aliStorage(C_COS_ALI_APPID, C_COS_ALI_SECRET, C_COS_ALI_REGION, C_COS_ALI_BUCKET).create(files, format);
      default:
        return await localStorage.create(files, format);
    }
  }
  static async destroy(filepath) {
    switch (C_UPLOAD_TYPE) {
      case 'tenxun':
        new tenxunStorage(C_COS_TX_APPID, C_COS_TX_SECRET, C_COS_TX_REGION, C_COS_TX_BUCKET).destroy(filepath);
      case 'ali':
        aliStorage(C_COS_ALI_APPID, C_COS_ALI_SECRET, C_COS_ALI_REGION, C_COS_ALI_BUCKET).destroy(filepath);
      default:
        localStorage.destroy(filepath);
    }
    return;
  }
}

module.exports = Storager;