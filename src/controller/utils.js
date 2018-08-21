module.exports = {
  'get /utils/request(\.html)?': (req, res, next) => {
    res.render('utils/request', { UI_SITE });
  },
  'get /utils/response(\.html)?': (req, res, next) => {
    res.render('utils/response', { UI_SITE });
  },
  'get /utils/html-tree(\.html)?': (req, res, next) => {
    res.render('utils/html-tree', { UI_SITE });
  },
  'get /utils/html-beauty(\.html)?': (req, res, next) => {
    res.render('utils/html-beauty', { UI_SITE });
  },
  'get /utils/recognition-body(\.html)?': (req, res, next) => {
    res.render('utils/recognition-body', { UI_SITE });
  },
  'get /utils/recognition-images(\.html)?': (req, res, next) => {
    res.render('utils/recognition-images', { UI_SITE });
  },
};