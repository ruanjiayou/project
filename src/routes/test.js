const fs = require('fs');

module.exports = {
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
   * @api {get} /test/res-error 7.测试res添加error()方法
   * @apiGroup test-res-error
   */
  'get /test/res-error': (req, res, next) => {
    throw new Error('test');
  }
};