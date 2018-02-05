const i18n = global.$cfgs.i18n;
module.exports = function (req, res, next) {
    let lang = req.cookies.lang;
    req.locale = i18n.langs.indexOf(lang) === -1 ? i18n.default : lang;
    res.locale = req.locale;
    next();
};