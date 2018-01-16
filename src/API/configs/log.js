module.exports = {
    // 日志持久化方案: debug console null redis 异步文件 同步文件 邮件...
    type: 'fileSync',
    // 存储的位置(相对app.js文件)
    filename: '../logs/info.txt',
    level: 'info'
};