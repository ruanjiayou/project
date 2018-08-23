const _ = require('lodash');
const emailCfg = require(CONFIG_PATH + '/email');
const fs = require('fs');
const path = require('path');

const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const debug = require('debug')('APP:email');

// 开启一个SMTP连接池
const transport = nodemailer.createTransport(smtpTransport({ emailCfg }));

function render(filename, data) {
  //TODO: 模板渲染_
  return '';
}
async function sendMail(users, subject, html) {
  debug('ENTER send email method!');
  // 设置邮件内容
  const options = {
    //TODO:
    from: '',
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
        debug(error);
      } else {
        debug(res);
      }
    });
  }
}

module.exports = {
  sendMail,
  render
};