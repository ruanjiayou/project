const ioHelper = require('../ioHelper');
const mime = require('mime');
const fs = require('fs');

class LocalStorage {
  static _storeOne(file, format) {
    let filepath = '', relpath = '';
    let isExisted = true;
    let ext = mime.getExtension(file.mimetype);
    while (isExisted) {
      relpath = `/${ioHelper.generatePath(format)}.${ext}`;
      filepath = STATIC_PATH + relpath;
      if (!ioHelper.isFileExists(filepath)) {
        isExisted = false;
        ioHelper.mkdirs(ioHelper.getPathInfo(filepath)['dir']);
        ioHelper.moveFile(file.path, filepath);
      }
    }
    return relpath;
  }
  static async create(files, format) {
    const res = [];
    const res2 = {};
    if (typeof format === 'string') {
      for (let i = 0; i < files.length; i++) {
        let relpath = LocalStorage._storeOne(files[i], format);
        res.push(relpath);
      }
      return res;
    } else {
      for (let key in format) {
        res2[key] = [];
      }
      for (let i = 0; i < files.length; i++) {
        const field = files[i].fieldname;
        if (format[field] === undefined) {
          continue;
        }
        let relpath = LocalStorage._storeOne(files[i], format[field]);
        res2[field].push(relpath);
      }
      return res2;
    }
  }
  static async destroy(filepath) {
    fs.unlink(UPLOAD_PATH + filepath);
  }
}
module.exports = LocalStorage;