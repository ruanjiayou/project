const cors = require('./libs/').cors;

const userAuthRoute = require('./BLLs/auth/user');
const userRoute = require('./routes/user/user');
const publicImageRoute = require('./BLLs/image');

module.exports = function (app) {
    app.use('*', cors);
    require('./routes/www')(app);
    app.use('/user/*', userAuthRoute.auth);

    // 账号验证
    app.post('/auth/user/sign-in', userAuthRoute.signIn);
    app.post('/auth/user/sign-up', userAuthRoute.signUp);
    app.post('/auth/user/refresh-token', userAuthRoute.refreshToken);
    app.post('/auth/user/forgot-password', userAuthRoute.varifyEmail);
    app.post('/auth/user/reset-password', userAuthRoute.resetPassword);
    app.post('/auth/user/change-password', userAuthRoute.forgotPassword);

    app.get('/users', userRoute.list);
    app.get('/user/self', userRoute.show);

    app.get('/images', publicImageRoute.list);
    app.get('/images/:imageId([0-9]+)', publicImageRoute.show);
    app.put('/images/:imageId([0-9]+)', publicImageRoute.update);
    app.post('/images', publicImageRoute.create);
    app.delete('/images/:imageId([0-9]+)', publicImageRoute.destroy);
};