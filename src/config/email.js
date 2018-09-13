module.exports = {
  secure: true,// 使用SSL
  secureConnection: true,// 使用SSL
  host: EMAIL_QQ.HOST,
  port: EMAIL_QQ.PORT,// SMTP端口
  auth: {
    user: EMAIL_QQ.USER,// 账号
    pass: EMAIL_QQ.PASS// 授权码
  }
};