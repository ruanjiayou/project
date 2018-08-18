const i18nCfg = require(CONFIG_PATH + 'i18n');
module.exports = function (req, res, next) {
  let lang = req.cookies.lang;
  req.locale = i18nCfg.langs.indexOf(lang) === -1 ? i18nCfg.default : lang;
  res.locale = req.locale;
  next();
};