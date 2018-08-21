const UtilsBLL = require('../../BLL/UtilsBLL');

module.exports = {
  /**
   * @api {post} /v1/public/utils/request 返回请求信息
   */
  'post /v1/public/utils/request': async (req, res, next) => {
    const result = await UtilsBLL.request(req);
    res.return(result);
  },
  /**
   * @api {post} /v1/public/utils/response 返回远程响应信息
   * @apiParam {string} url
   */
  'post /v1/public/utils/response': async (req, res, next) => {
    const result = await UtilsBLL.response(req.body.url);
    res.return(result);
  },
  /**
   * @api {post} /v1/public/utils/html-tree 返回远程响应信息树结构
   * @apiParam {string} url
   */
  'post /v1/public/utils/html-tree': async (req, res, next) => {
    const result = await UtilsBLL.htmlTree(req.body.url);
    res.return(result);
  },
  /**
   * @api {post} /v1/public/utils/html-beauty 格式化html
   * @apiParam {string} html
   */
  'post /v1/public/utils/html-beauty': async (req, res, next) => {
    const result = UtilsBLL.htmlBeauty(req.body.html);
    res.return(result);
  },
  /**
   * @api {post} /v1/public/utils/recognition-body 正文识别
   * @apiParam {string} url
   * @apiParam {string} type 单页/多页
   */
  'post /v1/public/utils/recognition-body': async (req, res, next) => {
    const result = await UtilsBLL.recognitionBody(req.body.url, req.body.type);
    res.return(result);
  },
  /**
   * @api {post} /v1/public/utils/recognition-images 返回请求信息
   * @apiParam {string} url
   * @apiParam {string} type 正则或node节点
   */
  'post /v1/public/utils/recognition-images': async (req, res, next) => {
    const result = await UtilsBLL.recognitionImages(req.body.url, req.body.type);
    res.return(result);
  }
};