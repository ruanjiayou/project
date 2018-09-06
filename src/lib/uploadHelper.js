const localStorage = require('./storageStrategy/local');
const aliStorage = require('./storageStrategy/ali');
const tenxunStorage = require('./storageStrategy/tenxun');

module.exports = function (field, format) {
  console.log(this.files);// 数组 多文件是多个对象 
  // fieldname originalname encoding mimetype destination filename path size
  switch (C_UPLOAD_TYPE) {
    case 'tenxun':
      return tenxunStorage(this.files, field, format);
    case 'ali':
      return aliStorage(this.files, field, format);
    default:
      return localStorage(this.files, field, format);
  }
};