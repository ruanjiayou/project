const ioHelper = require('../ioHelper');
const mime = require('mime');

module.exports = function (files, field, format) {
  const res = [];
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    if (file.fieldname === field) {
      let filepath = '', relpath = '';
      let isExisted = true;
      let ext = mime.getExtension(file.mimetype);
      while (isExisted) {
        relpath = '/' + ioHelper.generatePath(format) + '.' + ext;
        filepath = STATIC_PATH + relpath;
        if (!ioHelper.isFileExists(filepath)) {
          isExisted = false;
          ioHelper.mkdirs(ioHelper.getPathInfo(filepath)['dir']);
          ioHelper.moveFile(file.path, filepath);
        }
      }
      res.push(relpath);
    }
  }
  return res;
};