const fs = require('fs');
const wxHelper = require(LIB_PATH + '/wxHelper');

module.exports = {
  /**
   * @api {get} /test/check-project 0.检查项目的必要条件是否满足
   * @apiGroup test-check-project
   */
  'get /test/check-project': async (req, res, next) => {
    return '1.检查全局变量;2.检查必要初始数据;3.'
  },
  /**
   * @api {get} /test/string 1.测试返回字符串
   * @apiGroup test-string
   * 
   * @apiSuccessExample Success-Response:
   * HTTP/1.1 200 OK
   * Hello World
   */
  'get /test/string': (req, res, next) => {
    res.send('Hello World');
  },
  /**
   * @api {get} /test/json 2.测试返回对象
   * @apiGroup test-json
   * 
   * @apiSuccessExample Success-Response:
   * HTTP/1.1 200 OK
   * {
   *   key: 'value'
   * }
   */
  'get /test/json': (req, res, next) => {
    res.json({ key: 'value' });
  },
  /**
   * @api {get} /test/image 3.测试返回图片
   * @apiGroup test-image
   */
  'get /test/image': (req, res, next) => {
    // 方法一:
    // res.set({ 'Content-Tye': 'image/jpeg' });
    // res.sendFile(STATIC_PATH + 'logo.jpg');
    // 方法二:
    fs.createReadStream(STATIC_PATH + 'logo.jpg').pipe(res);
  },
  /**
   * @api {get} /test/download 4.测试下载文件
   * @apiGroup test-download
   */
  'get /test/download': (req, res, next) => {
    res.download(STATIC_PATH + 'logo.jpg');
  },
  /**
   * @api {get} /test/req-paging 5.测试处理分页querystring
   * @apiGroup test-req-paging
   */
  'get /test/req-paging': (req, res, next) => {
    res.json(req.paging());
  },
  /**
   * @api {get} /test/res-return 6.测试res添加return()方法
   * @apiGroup test-res-return
   */
  'get /test/res-return': (req, res, next) => {
    res.return({ key: 'value' });
  },
  /**
   * @api {get} /test/res-paging 7.测试res添加paging()方法
   * @apiGroup test-res-paging
   */
  'get /test/res-paging': (req, res, next) => {
    res.send('这里不好测试');
  },
  /**
   * @api {get} /test/res-success 8.测试res添加success()方法
   * @apiGroup test-res-success
   */
  'get /test/res-success': (req, res, next) => {
    res.success();
  },
  /**
   * @api {get} /test/res-fail 9.测试res添加fail()方法
   * @apiGroup test-res-fail
   */
  'get /test/res-fail': (req, res, next) => {
    res.fail();
  },
  /**
   * @api {get} /test/res-error 10.测试res添加error()方法
   * @apiGroup test-res-error
   */
  'get /test/res-error': (req, res, next) => {
    throw new Error('test');
  },
  /**
   * @api {put} /test/api-put 11.测试put请求和组合API,原样返回数据
   * @apiGroup test-put
   */
  'put /test/put': (req, res, next) => {
    return req.body;
  },
  /**
   * @api {get} /test/get 12.测试get请求返回字符串以及组合API
   * @apiGroup test-get
   */
  'get /test/get': (req, res, next) => {
    return 'test-api-group-string';
  },
  /**
   * @api {post} /v1/api-group 13.测试组合API
   * @apiGroup test-api-group
   * @apiDescription 'post /v1/api-group',req.body.apis是数组,每项有type/url/body/query/params
   */
  'post /v1/api-group': async (req, res, next) => {
    return 'api-group';
  },
  /**
   * @api {post} /test/local-upload-array 上传服务器返回数组
   * @apiGroup test-upload
   */
  'post /test/local-upload-array': async (req, res, next) => {
    let urls = await req.upload('test/{Y}-{m}-{d}/{hh}{ii}{ss}-{6}');
    return urls;
  },
  /**
   * @api {post} /test/local-upload-object 上传服务器返回对象
   * @apiGroup test-upload
   */
  'post /test/local-upload-object': async (req, res, next) => {
    let urls = await req.upload({ 'test': 'test/{Y}-{m}-{d}/{hh}{ii}{ss}-{6}' });
    return urls;
  },
  /**
   * @api {post} /test/ali-upload-array 阿里云对象存储
   * @apiGroup test-cos-ali
   * @apiParam {string} appid
   * @apiParam {string} secret
   * @apiParam {string} region
   * @apiParam {string} bucket
   * @apiParam {file} images 图片数组
   */
  'post /test/ali-upload-array': async (req, res, next) => {
    const Cos = require(LIB_PATH + '/storageStrategy/ali');
    const data = req.body;
    const result = await new Cos(data.appid, data.secret, data.region, data.bucket).create(req.files, 'test/{Y}-{m}-{d}/{hh}{ii}{ss}-{6}');
    return result;
  },
  /**
   * @api {delete} /test/ali-upload 阿里云删除文件
   * @apiGroup test-cos-ali
   * @apiParam {string} appid
   * @apiParam {string} secret
   * @apiParam {string} region
   * @apiParam {string} bucket
   * @apiParam {file} filepath 文件路径
   */
  'delete /test/ali-upload': async (req, res, next) => {
    const Cos = require(LIB_PATH + '/storageStrategy/ali');
    const data = req.body;
    const result = await new Cos(data.appid, data.secret, data.region, data.bucket).destroy(data.filepath);
    return result;
  },
  /**
   * @api {post} /test/wx-upload-array 腾讯云对象存储
   * @apiGroup test-cos-tx
   * @apiParam {string} appid
   * @apiParam {string} secretId
   * @apiParam {string} secretKey
   * @apiParam {string} region
   * @apiParam {string} bucket
   * @apiParam {file} images 图片数组
   */
  'post /test/wx-upload-array': async (req, res, next) => {
    const Cos = require(LIB_PATH + '/storageStrategy/tenxun');
    const data = req.body;
    // console.log(req.files);
    const result = await new Cos(data.appid, data.secretId, data.secretKey, data.region, data.bucket).create(req.files, { test: 'vehicle-logo/{Y}-{m}-{d}/{hh}{ii}{ss}-{6}' });
    return result;
  },
  /**
   * @api {delete} /test/wx-upload 腾讯云删除文件
   * @apiGroup test-cos-tx
   * @apiParam {string} appid
   * @apiParam {string} secretId
   * @apiParam {string} secretKey
   * @apiParam {string} region
   * @apiParam {string} bucket
   * @apiParam {string} filepath 文件路径
   */
  'delete /test/wx-upload': async (req, res, next) => {
    const Cos = require(LIB_PATH + '/storageStrategy/tenxun');
    const data = req.body;
    const result = await new Cos(data.appid, data.secretId, data.secretKey, data.region, data.bucket).destroy(data.filepath);
    return result;
  },
  /**
   * @api {post} /test/wx-info 获取微信信息
   * @apiGroup test-wx
   * @apiParam {string} appid
   * @apiParam {string} secret
   * @apiParam {string} code
   */
  'post /test/wx-info': async (req, res, next) => {
    const result = await wxHelper.getWxmInfo(req.body.appid, req.body.secret, req.body.code);
    return result;
  },
  /**
   * @api {post} /test/wx-access-token 获取凭证
   * @apiGroup test-wx
   * @apiParam {string} appid
   * @apiParam {string} secret
   */
  'post /test/wx-access-token': async (req, res, next) => {
    const accessToken = await wxHelper.getAccessToken(req.body.appid, req.body.secret);
    return accessToken;
  },
  /**
   * @api {post} /test/wx-phone 获取微信手机号
   * @apiGroup test-wx
   * @apiParam {string} appid
   * @apiParam {string} secret
   * @apiParam {string} code
   * @apiParam {string} encryptedData
   * @apiParam {string} iv
   */
  'post /test/wx-phone': async (req, res, next) => {
    const info = await wxHelper.getWxmPhone(
      req.body.appid,
      req.body.secret,
      req.body.code,
      req.body.encryptedData,
      req.body.iv);
    return info;
  },
  /**
   * @api {post} /test/wx-sms 发送腾讯云短信
   * @apiGroup test-sms
   * @apiParam {string} [appid] 应用id
   * @apiParam {string} [secret] 应用密匙
   * @apiParam {string} [county=86] 国家代码
   * @apiParam {string} phone 手机号
   * @apiParam {string} sign 短信签名
   * @apiParam {int} tplId 短信模板Id
   */
  'post /test/wx-sms': async (req, res, next) => {
    const data = req.body;
    const SmsHelper = require(LIB_PATH + '/smsStrategy/tenxun');
    const smsHelper = new SmsHelper(data.appid, data.appkey);
    const result = await smsHelper.send(data, ['123456', '10']);
    return result;
  },
  /**
   * @api {post} /test/ali-sms 发送阿里云短信
   * @apiGroup test-sms
   * @apiParam {string} appid id
   * @apiParam {string} secret 密匙
   * @apiParam {string} phone 手机号
   * @apiParam {string} sign 短信签名
   * @apiParam {int} tplId 短信模板Id
   */
  'post /test/ali-sms': async (req, res, next) => {
    const data = req.body;
    const SmsHelper = require(LIB_PATH + '/smsStrategy/ali');
    const smsHelper = new SmsHelper(data.appid, data.secret);
    const info = {
      phone: data.phone,
      sign: data.sign,
      tplId: data.tplId
    };
    delete data.phone;
    delete data.sign;
    delete data.tplId;
    delete data.appid;
    delete data.secret;
    const result = await smsHelper.send(info, data);
    return result;
  },
  /**
   * @api {post} /test/qq-email 发送qq邮件
   * @apiGroup test-email
   * @apiParam {string} name
   * @apiParam {string} email
   * @apiParam {string} subject
   * @apiParam {string} html
   */
  'post /test/qq-email': async (req, res, next) => {
    const emailHelper = require(LIB_PATH + '/emailHelper');
    const data = req.body;
    await emailHelper.sendMail([{ name: data.name, email: data.email }], data.subject, data.html);
    return;
  }
};