const express = require('express');
const Server = express();
const path = require('path');
const ejs = require('ejs');
// 1.设置express模板引擎
Server.set('views', path.join(__dirname, '../API/templates', 'views'));
Server.set('view engine', 'html');
Server.engine('.html', ejs.__express);
ejs.delimiter = '$';
// 2.静态目录
Server.use(express.static(path.join(__dirname, './public')));

// 8.404
Server.use(function (req, res) {
    if (!res.headersSent) {
        res.status(404).render('404');
    }
});


if (module.parent) {
    module.exports = Server;
} else {
    // 监听端口，启动程序
    Server.listen(9002, '0.0.0.0', function () {
        console.log('移动端 mobile.minivictory.com 监听端口:9002');
    });
}