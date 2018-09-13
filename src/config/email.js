module.exports = {
  secure: true,// 使用SSL
  secureConnection: true,// 使用SSL
  host: EMAIL[C_EMAIL_TYPE].HOST,
  port: EMAIL[C_EMAIL_TYPE].PORT,// SMTP端口
  auth: {
    user: EMAIL[C_EMAIL_TYPE].USER,// 账号
    pass: EMAIL[C_EMAIL_TYPE].PASS// 授权码
  }
};