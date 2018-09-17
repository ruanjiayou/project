const _ = require('lodash');
const ChapterBLL = require(BLL_PATH + '/ChapterBLL');
const chapterBLL = new ChapterBLL();

module.exports = {
  /**
   * @api {get} /v2/public/book/:bookId([0-9]+)/chapters 章节列表
   * @apiGroup public-book-chapter
   */
  'get /v2/public/book/:bookId([0-9]+)/chapters': async (req, res, next) => {
    const hql = req.paging((q) => {
      q.limit = 0;
      q.where['bookId'] = req.params.bookId;
      q.attributes = 'id,bookId,title,order,createdAt,updatedAt';
      return q;
    });
    const result = await chapterBLL.getList(hql);
    return res.paging(result, hql);
  },
  /**
   * @api {get} /v2/public/book/:bookId([0-9]+)/chapter/:chapterId([0-9]+) 章节详情
   * @apiGroup public-book-chapter
   */
  'get /v2/public/book/:bookId([0-9]+)/chapter/:chapterId([0-9]+)': async (req, res, next) => {
    const result = await chapterBLL.getInfo({ where: req.params.chapterId });
    return res.return(result);
  }
};