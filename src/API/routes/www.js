const debug = require('debug')('APP:www_route');

module.exports = function (app) {

    app.get(['/', '/index', 'index.html'], function (req, res) {
        res.render('index');
    });

    app.get('/sign-in', function (req, res) {
        debug('enter /sign-in route!');
        res.render('sign-in.html');
    });
    app.get('/sign-up', function (req, res) {
        debug('enter /sign-up route!');
        res.render('sign-in.html');
    });
    app.get('/active-email/:token', function (req, res) {
        debug('enter /active-email route!');
        //TODO:如果数据库没找到token则过期,否则修改对应user isApproved true status using
        res.render('active-email.html');
    });
    // email/phone
    app.get('/reset-password', function (req, res) {
        debug('enter /reset-password route!');
        res.render('reset-password.html');
    });
    app.get('/user/change-password', function (req, res) {
        debug('enter /change-password route!');
        res.render('change-password.html');
    });

};