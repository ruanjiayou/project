const fs = require('fs');
const mime = require('mime');
const ioHelper = require('../ioHelper');
const OSS = require('ali-oss');

class Cos {
  constructor(keyId, keySecret, region, bucket) {
    this.keyId = keyId;
    this.keySecret = keySecret;
    this.region = region;
    this.bucket = bucket;
    this.client = OSS({
      accessKeyId: this.keyId,
      accessKeySecret: this.keySecret,
      region: this.region,
      bucket: this.bucket
    });
  }
  async create(files, format) {
    const that = this;
    let res = [];
    const res2 = {};
    const fields = [];
    const type = typeof format === 'string' ? 'array' : 'object';
    if (type === 'array') {
      files.forEach(function (item) {
        fields.push(item.fieldname);
        res.push(new Promise(function (resolve, reject) {
          const filepath = ioHelper.generatePath(`${format}.${mime.getExtension(item.mimetype)}`.replace(/\\/g, '/'));
          resolve(that.client.put(filepath, item.path));
        }))
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
  async destroy(filepath) {
    return await this.client.delete(filepath);
  }
}
module.exports = Cos;