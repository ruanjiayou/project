const multer = require('multer');
const config = global.$cfgs.upload;
const path = require('path');

// 上传路径处理 ,上传文件重命名
let storage = multer.diskStorage({
    // 上传路径处理
    destination: path.join(process.cwd(), config.dest),
    // filename: function (req, file, cb) {  // file上传的文件信息, callback 重命名处理
    //     //return cb(null, `${io.GUID()}.${mime.extension(file.mimetype)}`);
    // }
});

const fileFilter = function (req, file, cb) {
    const exts = new Set(['ics', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt', 'rtf', 'html', 'zip', 'mp3', 'wma', 'mpg', 'flv', 'avi', 'jpg', 'jpeg', 'png', 'gif']);
    // file.mimetype === 'image/gif'
    let ext = path.extname(file.originalname).substring(1).toLowerCase();
    // 是否是允许的类型
    cb(null, exts.has(ext));
};

let uploader = multer({
    // 上传文件路径,名字设置
    storage: storage,
    limits: config.limits, //限制文件的大小
    fileFilter: fileFilter //文件的类型, 过滤
}).fields([{
    name: 'file',
    maxCount: 10
}]);



module.exports = uploader;;
