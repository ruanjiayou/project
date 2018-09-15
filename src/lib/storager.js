const localStorage = require('./storageStrategy/local');
const aliStorage = require('./storageStrategy/ali');
const tenxunStorage = require('./storageStrategy/tenxun');

class Storager {
  static async create(files, format) {
    switch (C_STOREAGE_TYPE) {
      case 'tx':
        return await new tenxunStorage(
          COS[C_STOREAGE_TYPE][APPID],
          COS[C_STOREAGE_TYPE][SECRETID],
          COS[C_STOREAGE_TYPE][SECRETKEY],
          COS[C_STOREAGE_TYPE][REGION],
          COS[C_STOREAGE_TYPE][BUCKET]
        ).create(files, format);
      case 'ali':
        return await new aliStorage(
          COS[C_STOREAGE_TYPE][APPID],
          COS[C_STOREAGE_TYPE][SECRET],
          COS[C_STOREAGE_TYPE][REGION],
          COS[C_STOREAGE_TYPE][BUCKET]
        ).create(files, format);
      default:
        return await localStorage.create(files, format);
    }
  }
  static async destroy(filepath) {
    switch (C_STOREAGE_TYPE) {
      case 'tx':
        new tenxunStorage(
          COS[C_STOREAGE_TYPE][APPID],
          COS[C_STOREAGE_TYPE][SECRETID],
          COS[C_STOREAGE_TYPE][REGION],
          COS[C_STOREAGE_TYPE][BUCKET]
        ).destroy(filepath);
      case 'ali':
        aliStorage(
          COS[C_STOREAGE_TYPE][APPID],
          COS[C_STOREAGE_TYPE][SECRET],
          COS[C_STOREAGE_TYPE][REGION],
          COS[C_STOREAGE_TYPE][BUCKET]
        ).destroy(filepath);
      default:
        localStorage.destroy(filepath);
    }
    return;
  }
}

module.exports = Storager;