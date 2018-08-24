module.exports = {
  secure: true,// 使用SSL
  secureConnection: true,// 使用SSL
  host: EMAIL_HOST,
  port: EMAIL_PORT,// SMTP端口
  auth: {
    user: EMAIL_AUTH_USER,// 账号
    pass: EMAIL_AUTH_PASS// 授权码
  }
};