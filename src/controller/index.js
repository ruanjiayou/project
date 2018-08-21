module.exports = {
  'get /index(\.html)?': (req, res, next) => {
    console.log(UI_SITE);
    res.render('index', { UI_SITE });
  }
}