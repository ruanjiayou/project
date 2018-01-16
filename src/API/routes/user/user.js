const userBLL = require('../../BLLs/user');
const debug = require('debug')('APP:user_route');

/**
 * @api /user/self 用户账号信息
 * @apiName show
 * @apiGroup user
 * @apiSuccess {int} id 账号id
 */
async function show(req, res, next) {
    debug('enter user route!');
    req.params.userId = res.locals.userAuth.id;
    return userBLL.show(req, res, next);
}

module.exports = {
    show
};