const path = require('path');
const fs = require('fs');
const dir = path.join(__dirname, 'routes');
// TODO: use顺序优先
function scanner(dirname, app) {
    fs.readdirSync(dirname).forEach((file) => {
        let fullname = path.join(dirname, file);
        let ext = path.extname(file);
        if (fs.existsSync(fullname) && fs.lstatSync(fullname).isDirectory()) {
            scanner(fullname, app);
        } else if (fullname !== module.filename && ext.toLowerCase() === '.js') {
            let route = require(fullname);
            Object.keys(route).forEach((key) => {
                const [method, path] = key.split(' ');
                app[method](path, route[key]);
            });
        }
    });
}

module.exports = function (app) {
    scanner(dir, app);
};