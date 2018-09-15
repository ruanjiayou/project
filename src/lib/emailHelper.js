const _ = require('lodash');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const debug = require('debug')('APP:email');
const emailCfg = require(CONFIG_PATH + '/email');

// 开启一个SMTP连接池
const transport = nodemailer.createTransport(smtpTransport({
  secure: true,// 使用SSL
  secureConnection: true,// 使用SSL
  host: emailCfg.HOST,
  port: emailCfg.PORT,
  auth: {
    user: emailCfg.auth.user,
    pass: emailCfg.auth.pass
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
    from: emailCfg.auth.user,
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