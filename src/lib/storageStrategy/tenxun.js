const fs = require('fs');
const mime = require('mime');
const ioHelper = require('../ioHelper');
const COS = require('cos-nodejs-sdk-v5');

class Cos {
  constructor(appid, secretId, secretKey, region, bucket) {
    this.APPID = appid;
    this.SECRETID = secretId;
    this.secretKey = secretKey;
    this.REGION = region;
    this.BUCKET = bucket;
    this.cos = new COS({ SecretId: secretId, SecretKey: secretKey });
  }
  _storeOne(file, format) {
    const that = this;
    return new Promise(function (resolve, reject) {
      const filepath = ioHelper.generatePath(`${format}.${mime.getExtension(file.mimetype)}`);
      that.cos.putObject({
        Bucket: `${that.BUCKET}-${that.APPID}`,
        Region: that.REGION,
        Key: filepath,
        ContentLenth: file.size,
        Body: fs.createReadStream(file.path)
      }, (err, res) => {
        if (err) {
          console.log(err);
          resolve('');
        } else {
          resolve(res);
        }
      });
    });
  }
  /**
   * 上传文件
   * @param {files} files 
   */
  async create(files, format) {
    const that = this;
    let res = [];
    const res2 = {};
    const fields = [];
    const type = typeof format === 'string' ? 'array' : 'object';
    if (typeof format === 'string') {
      files.forEach(function (item) {
        fields.push(item.fieldname);
        res.push(that._storeOne(item, format));
      });
    } else {
      files.forEach(function (item) {
        const fieldname = item.fieldname;
        if (format[fieldname] === undefined) {
          return;
        }
        fields.push(fieldname);
        res.push(that._storeOne(item, format[fieldname]));
      });
    }
    if (type === 'array') {
      return await Promise.all(res);;
    } else {
      res = await Promise.all(res);
      res.forEach(function (item, index) {
        res2[fields[index]].push(item);
      });
      return res2;
    }
  }
  /**
   * 删除远程文件
   * @param {string} filepath 
   */
  async destroy(filepath) {
    filepath = filepath.replace(/^[/]/, '');
    const bucket = filepath.split('/')[0];
    const that = this;
    const res = await new Promise(function (resolve, reject) {
      that.cos.deleteObject({
        Bucket: `${bucket}-${that.APPID}`,
        Region: that.REGION,
        Key: filepath
      }, (err, data) => {
        if (err) {
          resolve(null);
        } else {
          resolve(data);
        }
      });
    });
    return res;
  }
}

module.exports = Cos;