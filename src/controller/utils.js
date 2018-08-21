module.exports = {
  'get /utils/:file': (req, res, next) => {
    res.render('utils/' + req.params.file + '.html', { UI_SITE });
  }
};