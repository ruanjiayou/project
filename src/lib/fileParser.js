const multer = require('multer');
const uploadCfg = require(CONFIG_PATH + '/upload');

const fileParser = multer({
  storage: multer.diskStorage({
    destination: uploadCfg.tmp
    // filename
  }),
  limits: uploadCfg.limits
  // fileFilter
}).any();//.fields() 指定上传字段

module.exports = fileParser;