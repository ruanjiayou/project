const _ = require('lodash');
const ioHelper = require(LIB_PATH + '/ioHelper');
const ChapterBLL = require(BLL_PATH + '/ChapterBLL');
const chapterBLL = new ChapterBLL();

module.exports = {
  /**
   * @api {get} /v2/public/book/:bookId([0-9]+)/chapters 章节列表
   * @apiGroup public-book-chapter
   */
  'get /v2/public/book/:bookId([0-9]+)/chapters': async (req, res, next) => {
    let result = null;
    const cachePath = `${CACHE_PATH}/books/${req.params.bookId}.json`;
    if (ioHelper.isFileExists(cachePath)) {
      result = JSON.parse(ioHelper.readTxt(cachePath));//17
    } else {
      result = await chapterBLL.getList({ limit: 0, where: { bookId: req.params.bookId }, attributes: 'id,bookId,title' });//266
      result = _.isArray(result) ? result : (result.rows ? result.rows.map(function (item) { return item.toJSON ? item.toJSON() : item; }) : []);
      ioHelper.writeTxt(cachePath, JSON.stringify(result));
    }
    return res.return(result);
  },
  /**
   * @api {get} /v2/public/book/:bookId([0-9]+)/chapter/:chapterId([0-9]+) 章节详情
   * @apiGroup public-book-chapter
   */
  'get /v2/public/book/:bookId([0-9]+)/chapter/:chapterId([0-9]+)': async (req, res, next) => {
    let result = null;
    // const cachePath = `${CACHE_PATH}/chapters/${req.params.bookId}/${req.params.chapterId}.json`;
    // if (ioHelper.isFileExists(cachePath)) {
    //   result = JSON.parse(ioHelper.readTxt(cachePath));
    // } else {
    //   ioHelper.mkdirs(`${CACHE_PATH}/chapters/${req.params.bookId}`);
    //   result = await chapterBLL.getInfo({ where: req.params.chapterId });
    //   ioHelper.writeTxt(cachePath, JSON.stringify(result));
    // }
    result = await chapterBLL.getInfo({ where: req.params.chapterId });
    return res.return(result);
  }
};