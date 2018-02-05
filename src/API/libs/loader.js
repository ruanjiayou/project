const fs = require('fs');
const path = require('path');
const libs = {};

fs.readdirSync(__dirname).forEach((file) => {
    let ext = path.extname(file);
    let filename = file.substr(0, file.length - 3);
    if (filename !== 'index' && ext === '.js') {
        libs[filename] = require(path.join(__dirname, file));
    }
});

module.exports = libs;