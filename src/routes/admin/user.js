const _ = require('lodash');
const UserBLL = require(BLL_PATH + '/UserBLL');
const userBLL = new UserBLL();

module.exports = {
  /**
   * @api {post} /v2/admin/user 添加用户
   * @apiGroup admin-user
   * @apiHeader {string} token 鉴权
   * @apiParam {string} name
   * @apiParam {string} name
   */
  'post /v2/admin/user': async (req, res, next) => {
    const result = await userBLL.fcreate(req.body);
    return result;
  },
  /**
   * @api {get} /v2/admin/users 查询用户
   * @apiGroup admin-user
   * @apiHeader {string} token 鉴权
   * @apiParam {string} search 昵称或手机号或邮箱
   */
  'get /v2/admin/users': async (req, res, next) => {
    const hql = req.paging((h, query) => {
      const Op = userBLL.models.Op;
      if (!_.isNil(h['search']) && h['search'] != '') {
        h['where'][Op.or] = {
          name: { [Op.like]: `%${h['search']}%` },
          phone: { [Op.like]: `%${h['search']}%` }
        };
      }
      return h;
    });
    const result = await userBLL.getList(hql);
    return result;
  },
  /**
   * @api {get} /v2/admin/user/:userId([0-9]+) 用户详情
   * @apiGroup admin-user
   * @apiHeader {string} token 鉴权
   */
  'get /v2/admin/user/:userId([0-9]+)': async (req, res, next) => {
    const result = await userBLL.get({ where: req.params.userId });
    return result;
  }
};