module.exports = {
  'get /404(\.html)?': (req, res, next) => {
    res.render('404');
  }
};