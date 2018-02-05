const fs = require('fs');
const dir = __dirname;
const path = require('path');
const BLLs = {};

function scanner(dirname) {
    fs.readdirSync(dirname).forEach((file)=>{
        let fullname= path.join(dirname, file);
        let ext = path.extname(file);
        // auth/user.js --> AuthUser
        let filename = fullname
            .replace(dir, '')
            .replace(/([.].+)$/, '')
            .replace(/\\/g, '/')
            .split('/')
            .map(function(item){
                let m = /^([a-z]).+$/.exec(item);
                if(m){
                    item = item.replace(m[1], m[1].toUpperCase());
                }
                return item;
            })
            .join('');
        if(fs.existsSync(fullname) && fs.lstatSync(fullname).isDirectory()){
            scanner(fullname);
        } else if(fullname!==module.filename && ext.toLowerCase() === '.js'){
            BLLs[filename] = require(fullname);
        }
    });
}
scanner(dir);

module.exports = BLLs;