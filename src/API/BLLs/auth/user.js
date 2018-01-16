// model
const models = require('../../models');

// libs
const Validator = require('utils2/lib/validator');
const authHelper = require('../../libs/').auth;
const debug = require('debug')('APP:auth_user');
/**
 * @api {get} /auth/user/login 进行sha1加盐加密 再与数据库的做对比
 * @apiName login
 * @apiGroup user login
 * 
 * @apiParam {string} password 密码(前端进行了md5加密)
 * @apiParam {string} account 名字或电子邮箱
 * 
 * @apiSuccess {boolean} status 请求是否成功
 * @apiSuccess {object} result 返回结果
 * @apiSuccess {string} [type="JWT"] token类型
 * @apiSuccess {string} token token字符串
 */
async function signIn(req, res, next) {
    debug('enter user singnIn method!');
    const validator = new Validator({
        rules: {
            password: 'required|string',
            account: 'required|string'
        }
    });
    const input = validator.filter(req.body);
    try {
        validator.check(input);
    } catch (err) {
        return next(err);
    }
    try {
        const filter = { where: {} };
        if (req.body.account) {
            filter.where[models.sequelize.Op.or] = {
                name: req.body.account,
                email: req.body.account,
                phone: req.body.account
            };
            let user = await models.User.findOne(filter);
            if (!user || !user.comparePassword(input.password)) {
                throw new HinterError('auth', 'accountValidFail');
            } else {
                user = user.get({ plain: true });
                const token = authHelper.encode({ refreshToken: '89757', email: user.email });
                res.return(token);
            }
        } else {
            throw new HinterError('auth', 'formEmpty');
        }
    } catch (err) {
        next(err);
    }
}

async function signUp(req, res, next) {
    debug('enter user singnUp method!');
    const validator = new Validator({
        rules: {
            password: 'required|string',
            email: 'required|string',
            birth: 'required|date',
            name: 'required|string',
            gender: 'nullable|string|in:m,f'
        }
    });
    const input = validator.filter(req.body);
    try {
        validator.check(input);
    } catch (err) {
        return next(err);
    }
    try {
        const filter = {
            where: { email: req.body.email }
        };
        let user = await models.User.findOne(filter);
        if (user) {
            throw new HinterError('common', 'exists');
        } else {
            user = await models.User.create(input);

            return res.return(user);
        }
    } catch (err) {
        next(err);
    }
}
/**
 * 发送 重置密码链接 的邮件
 */
async function varifyEmail() {

}
/**
 * 登录验证码
 */
async function varifySms() {

}

async function refreshToken() {

}

async function resetPassword() {

}

async function forgotPassword() {

}

async function auth(req, res, next) {
    debug('enter user auth method!');
    try {
        const token = authHelper.decode(req);
        const filter = {
            where: {
                email: token.email
            }
        };
        const user = await models.User.findOne(filter);
        if (!user) {
            throw new HinterError('auth', 'tokenInvalid');
        }
        res.locals.userAuth = user;
        res.locals.role = 'user';
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = {
    auth,
    signIn,
    signUp,
    varifyEmail,
    varifySms,
    refreshToken,
    resetPassword,
    forgotPassword
};