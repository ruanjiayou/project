const BookBLL = require(BLL_PATH + '/BookBLL');
const bookBLL = new BookBLL();

module.exports = {
  /**
   * @api {post} /v2/admin/book 不存在则添加书籍,否则直接返回
   * @apiGroup admin-book
   * @apiHeader {string} token 鉴权
   * @apiParam {string} name 书籍名称
   * @apiParam {string} poster 书籍封面
   * @apiParam {string} description 书籍描述
   * @apiParam {string} catalogs 书籍章卷
   * @apiParam {string} authorName 作者名称
   * @apiParam {string} cId 书籍分类
   */
  'post /v2/admin/book': async (req, res, next) => {
    const result = await bookBLL.fcreate(req.body);
    return result;
  },
  /**
   * @api {put} /v2/admin/book/:bookId([0-9]) 修改书籍
   * @apiGroup admin-book
   * @apiHeader {string} token 鉴权
   * @apiParam {string} [poster] 书籍封面
   * @apiParam {string} [description] 书籍描述
   * @apiParam {boolEAN} [isApproved] 是否禁止
   */
  'put /v2/admin/book/:bookId([0-9]+)': async (req, res, next) => {
    const result = await bookBLL.update(req.body, { where: req.params.bookId });
    return result;
  },
  /**
   * @api {get} /v2/admin/books 书籍列表
   * @apiGroup admin-book
   * @apiHeader {string} token 鉴权
   * @apiParam {string} [search] 查询字符串
   * @apiParam {int} [page] 页码
   * @apiParam {int} [limit] 每页数量
   * @apiParam {array} [words] 字数
   * @apiParam {array} [time] 更新时间
   */
  'get /v2/admin/books': async (req, res, next) => {
    const hql = req.paging((query) => {
      return query;
    });
    const result = await bookBLL.getList(hql);
    return result;
  },
  /**
   * @api {get} /v2/admin/book/:bookId 书籍详情
   * @apiGroup admin-book
   * @apiHeader {string} token 鉴权
   */
  'get /v2/admin/book/:bookId': async (req, res, next) => {
    const result = await bookBLL.get({ where: req.params.bookId });
    return result;
  }
};