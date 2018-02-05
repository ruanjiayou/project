const cors = global.$libs.cors;
const debug = require('debug')('APP:www_route');

module.exports = {
    'use /*': cors,
    'get /': function(req, res){
        debug('enter get / route!');
        res.render('index');
    },
    'get /sign-in': function(req, res) {
        debug('enter get /sign-in route!');
        res.render('sign-in');
    },
    'get /sign-up': function(req, res) {
        debug('enter get /sign-up route!');
        res.render('sign-up');
    },
    'get /active-email/:token': function(req, res) {
        debug('enter get /active-email route!');
        res.render('active-email');
    },
    'get /reset-password': function(req, res) {
        debug('enter get /reset-password route!');
        res.render('reset-password');
    },
    'get /user/change-password': function(req, res) {
        debug('enter get /change-password route!');
        res.render('change-password');
    }
};