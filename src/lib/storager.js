const localStorage = require('./storageStrategy/local');
const aliStorage = require('./storageStrategy/ali');
const tenxunStorage = require('./storageStrategy/tenxun');

class Storager {
  static create(files, field, format) {
    switch (C_UPLOAD_TYPE) {
      case 'tenxun':
        return tenxunStorage.create(files, field, format);
      case 'ali':
        return aliStorage.create(files, field, format);
      default:
        return localStorage.create(files, field, format);
    }
  }
  static destroy(filepath) {
    switch (C_UPLOAD_TYPE) {
      case 'tenxun':
        return tenxunStorage.destroy(filepath);
      case 'ali':
        return aliStorage.destroy(filepath);
      default:
        return localStorage.destroy(filepath);
    }
  }
}

module.exports = Storager;