const wsio = require('socket.io');
const debug = require('debug')('APP:ws');

module.exports = function (server) {
    const io = wsio(server);
    // 设置日志级别
    io.serveClient('log level', 1);
    // websocket连接监听
    io.on('connection', function (socket) {
        socket.emit('open');
        const client = {
            socket: socket,
            name: false,
            color: getColor()
        };
        // 对message时间的监听
        socket.on('message', function (msg) {
            let obj = {};
            // 判断是不是第一次连接,以第一条消息作为用户名
            if (!client.name) {
                client.name = msg;
                obj = {
                    text: msg,
                    author: 'System',
                    type: 'welcome',
                    time: getTime(),
                    color: client.color
                };
                debug(`${msg} login`);
                // 返回欢迎语
                socket.emit('system', obj);
                // 广播新用户登录
                socket.broadcast.emit('system', obj);
            } else {
                obj = {
                    text: msg,
                    author: client.name,
                    type: 'message',
                    time: getTime(),
                    color: client.color
                };
                debug(`${client.name} say:${msg}`);
                // 返回消息,可以省略
                socket.emit('message', obj);
                // 广播向其他用户发消息
                socket.broadcast.emit('message', obj);
            }
        });
        // 对退出事件的监听
        socket.on('desconnect', function () {
            let obj = {
                time: getTime(),
                color: client.color,
                author: 'System',
                text: client.name,
                type: 'disconnect'
            };
            // 广播用户已退出的信息
            socket.broadcase.emit('system', obj);
            debug(`${client.name} Disconnect`);
        });
    });
    return function (txt) {
        io.sockets.emit('message', {
            type: 'notify',
            author: 'System',
            text: txt,
            time: getTime()
        });
    };
};

function getTime() {
    let d = new Date();
    return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
}

function getColor() {
    var colors = ['aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'pink', 'red', 'green', 'orange', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue'];
    return colors[Math.round(Math.random() * 10000 % colors.length)];
}
