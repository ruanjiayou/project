module.exports = {
  'get /': (req, res, next) => {
    res.render('index', { UI_SITE });
  },
  'get /index(\.html)?': (req, res, next) => {
    res.render('index', { UI_SITE });
  }
}