const _ = require('lodash');
const sys = require('../configs/').site;
const config = require('../configs/').email;
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const debug = require('debug')('APP:email');
// 开启一个SMTP连接池
const transport = nodemailer.createTransport(smtpTransport({ config }));

function render(filename, data) {
    return ejs.render(fs.readFileSync(path.relative(__dirname, '../src/templates/emails/test.html')).toString(), data);
}
async function sendMail(users, subject, html) {
    debug('ENTER send email method!');
    // 设置邮件内容
    const options = {
        from: `"${sys.sys.name}" <${config.auth.user}>`,
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