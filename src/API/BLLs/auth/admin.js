// model
const models = require('../../models');

// lib
const authHelper = require('../../libs/').auth;

/**
 * @api {get} /auth/admin/login 进行sha1加盐加密 再与数据库的做对比
 * @apiName login
 * @apiGroup login
 * 
 * @apiParam {string} password 密码(前端进行了md5加密)
 * @apiParam {string} account 名字或电子邮箱
 * 
 * @apiSuccess {boolean} status 请求是否成功
 * @apiSuccess {object} result 返回结果
 * @apiSuccess {string} [type="JWT"] token类型
 * @apiSuccess {string} token token字符串
 */
async function login(req, res, next) {
    // sha1 加密加盐
    req.body.password = authHelper.encrypt(req.body.password);
    //console.log(req.body.password);
    const filter = {
        where: {
            password: req.body.password
        }
    };
    try {
        if (req.body.account) {
            filter.where[models.sequelize.Op.or] = {
                name: req.body.account,
                email: req.body.account
            };
            let admin = await models.User.findOne(filter);
            //console.log(admin);
            if (!admin) {
                throw new HinterError('auth', 'accountValidFail');
            } else {
                admin = admin.get({ plain: true });
                const token = authHelper.encode({ refreshToken: '89757', email: admin.email });
                res.return(token);
            }
        } else {
            throw new HinterError('auth', 'formEmpty');
        }
    } catch (err) {
        next(err);
    }
}

async function auth(req, res, next) {
    try {
        const token = authHelper.decode(req);
        const admin = await models.User.findOne({
            where: {
                email: token.email,
                roleId: 1
            }
        });
        if (!admin) {
            throw new HinterError('auth', 'tokenInvalid');
        }
        res.locals.adminAuth = admin;
        res.locals.role = 'admin';
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = {
    login,
    auth
};