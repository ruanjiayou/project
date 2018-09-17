const _ = require('lodash');
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
   * @api {get} /v2/public/book/:bookId 书籍详情
   * @apiGroup public-book
   */
  'get /v2/public/book/:bookId([0-9]+)': async (req, res, next) => {
    const result = await bookBLL.getInfo({ where: req.params.bookId });
    return res.return(result);
  }
};