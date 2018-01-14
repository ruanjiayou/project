const cors = require('./libs/').cors;

const adminAuthRoute = require('./BLLs/auth/admin');
const publicImageRoute = require('./BLLs/image');
module.exports = function (app) {
    app.use('*', cors);
    // 登录
    app.post('/auth/admin/login', adminAuthRoute.login);
    app.use('/admin/*', adminAuthRoute.auth);

    app.get('/images', publicImageRoute.list);
    app.get('/images/:imageId([0-9]+)', publicImageRoute.show);
};