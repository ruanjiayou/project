const _ = require('lodash');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const debug = require('debug')('APP:email');

// 开启一个SMTP连接池
const transport = nodemailer.createTransport(smtpTransport({
  secure: true,// 使用SSL
  secureConnection: true,// 使用SSL
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  auth: {
    user: EMAIL_AUTH_USER,
    pass: EMAIL_AUTH_PASS
  }
}));

function render(filename, data) {
  //TODO: 模板渲染_
  return '';
}
async function sendMail(users, subject, html) {
  debug('ENTER send email method!');
  // 设置邮件内容
  const options = {
    //TODO:
    from: EMAIL_AUTH_USER,
    subject,
    html
  };
  for (let i = 0; i < users.length; i++) {
    let user = users[i];
    // 发送邮件
    await transport.sendMail(_.extend(options, {
      to: `${user.name} <${user.email}>`
    }), function (error, res) {
      if (error) {
        console.log(error);
      } else {
        console.log(res);
      }
    });
  }
}

module.exports = {
  sendMail,
  render
};