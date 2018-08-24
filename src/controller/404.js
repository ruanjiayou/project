module.exports = {
  'get /404': (req, res, next) => {
    res.render('404');
  }
};