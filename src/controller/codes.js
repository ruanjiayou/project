module.exports = {
  'get /codes/:file': (req, res, next) => {
    res.render('codes/' + req.params.file + '.html', { UI_SITE });
  }
};