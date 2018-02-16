const fs = require('fs');
const dir = __dirname;
const path = require('path');
const BLLs = {};

function scanner (dirname) {
  fs.readdirSync(dirname)
    .forEach((file) => {
      const fullname = path.join(dirname, file);
      const ext = path.extname(file);
      // auth/user.js --> AuthUser
      const filename = fullname
        .replace(dir, '')
        .replace(/([.].+)$/, '')
        .replace(/\\/g, '/')
        .split('/')
        .map((item) => {
          const m = /^([a-z]).+$/.exec(item);
          if (m) {
            item = item.replace(m[1], m[1].toUpperCase());
          }
          return item;
        })
        .join('');
      if (fs.existsSync(fullname) && fs.lstatSync(fullname)
        .isDirectory()) {
        scanner(fullname);
      }
      else if (fullname !== module.filename && ext.toLowerCase() === '.js') {
        BLLs[filename] = require(fullname);
      }
    });
}
scanner(dir);

module.exports = BLLs;