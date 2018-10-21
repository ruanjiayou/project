const localStorage = require('./storageStrategy/local');
const aliStorage = require('./storageStrategy/ali');
const tenxunStorage = require('./storageStrategy/tenxun');

class Storager {
  /**
   * 文件保存策略
   * @param {string} strategy local/tx/ali/baidu
   */
  constructor(strategy) {
    let storage = localStorage;
    if (strategy === 'tx') {
      storage = new tenxunStorage(
        COS['tx'][APPID],
        COS['tx'][SECRETID],
        COS['tx'][SECRETKEY],
        COS['tx'][REGION],
        COS['tx'][BUCKET]
      );
    }
    if (strategy === 'ali') {
      storage = new aliStorage(
        COS['ali'][APPID],
        COS['ali'][SECRET],
        COS['ali'][REGION],
        COS['ali'][BUCKET]
      );
    }
    return storage;
  }
  /**
   * 保存文件
   * @param {file} files 
   * @param {格式} format 
   */
  async create(files, format) {

  }
  /**
   * 删除文件
   * @param {string} filepath 文件路径
   */
  async destroy(filepath) {

  }
}

module.exports = Storager;