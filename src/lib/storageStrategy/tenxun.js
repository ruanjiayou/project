
class Cos {
  //TODO: promise.all
  static async create(opt, file) {
    const res = await new Promise(function (resolve, reject) {
      cos.putObject({
        Bucket: `${opt.bucket}-${appid}`,
        Region: opt.region,
        Key: opt.filepath,
        ContentLenth: file[0].size,
        Body: fs.createReadStream(file[0].path)
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
  /**
   * 删除远程文件
   * @param {string} appid 
   * @param {string} region 
   * @param {string} bucket 
   * @param {string} filepath 
   */
  static destroy(appid, region, bucket, filepath) {
    Cos.deleteObject({
      Bucket: `${bucket}-${appid}`,
      Region: region,
      Key: filepath
    }, (err, data) => {

    });
  }
}

module.exports = Cos;