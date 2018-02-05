const userBLL = global.$BLLs.User;
const debug = require('debug')('APP:user_route');

module.exports = {
    /**
     * @api /users
     * @apiName list
     * @apiGroup user
     * @apiSuccess {int} id 账号id
     */
    'get /users': function(req, res, next) {
        debug('enter user list route!');
        return userBLL.list(req, res, next);
    },
    /**
     * @api /user/self 用户账号信息
     * @apiName show
     * @apiGroup user
     * @apiSuccess {int} id 账号id
     */
    'get /users/self': function(req, res, next) {
        debug('enter user route!');
        req.params.userId = res.locals.userAuth.id;
        return userBLL.show(req, res, next);
    }
};