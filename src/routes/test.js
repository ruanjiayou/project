const fs = require('fs');

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
   * @api {post} /v1/test-upload 14.本地上传
   * @apiGroup test-upload
   */
  'post /test-upload': async (req, res, next) => {
    let urls = req.upload('test', 'test/{Y}-{m}-{d}/{hh}{ii}{ss}-{6}');
    console.log(urls);
    return '测试上传(看控制台)';
  }
};