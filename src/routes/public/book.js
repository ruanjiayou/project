const _ = require('lodash');
const models = require(MODEL_PATH + '/index');
const BookBLL = require(BLL_PATH + '/BookBLL');
const bookBLL = new BookBLL();

module.exports = {
  /**
   * @api {get} /v2/public/books 书籍列表
   * @apiGroup public-book
   * @apiParam {string} [search] 查询字符串
   * @apiParam {int} [page] 页码
   * @apiParam {int} [limit] 每页数量
   * @apiParam {array} [words] 字数
   * @apiParam {array} [time] 更新时间
   */
  'get /v2/public/books': async (req, res, next) => {
    const hql = req.paging();
    const result = await bookBLL.getList(hql);
    return res.paging(result, hql);
  },
  /**
   * @api {put} /v2/public/book
   * @apiGroup public-book
   * @apiParam {int} name
   * @apiParam {int} authorName
   * @apiParam {int} poster
   * @apiParam {int} description
   */
  'put /v2/public/book': async (req, res, next) => {
    let result = await bookBLL.getInfo({ where: { name: req.body.name, authorName: req.body.authorName } });
    if (result) {
      await result.update({ poster: req.body.poster, description: req.body.description, words: req.body.words, inited: 1 });
      await models.Chapter.update({ bookId: req.body.bookId }, { where: { bookId: result.id } });
      return res.success();
    } else {
      // 后续下载
      let user = await models.User.findOne({ where: { name: req.body.authorName } });
      if (user == null) {
        user = await models.User.create({ name: req.body.name });
      }
      req.body.authorId = user.id;
      result = await bookBLL.create(req.body);
      return res.return(result);
    }
  },
  /**
   * @api {get} /v2/public/book/:bookId 书籍详情
   * @apiGroup public-book
   */
  'get /v2/public/book/:bookId([0-9]+)': async (req, res, next) => {
    const result = await bookBLL.getInfo({ where: req.params.bookId });
    return res.return(result);
  }
};