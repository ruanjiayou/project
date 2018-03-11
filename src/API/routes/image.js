const imageBLL = global.$BLLs.Image;
const debug = require('debug')('APP:image_route');

module.exports = {
    'get /images': function (req, res, next) {
        debug('enter get images route!');
        global.$ws('get images');
        imageBLL.list(req, res, next);
    },
    'get /images/:imageId([0-9]+)': function (req, res, next) {
        debug('enter get image route!');
        imageBLL.show(req, res, next);
    },
    'put /images/:imageId([0-9]+)': function (req, res, next) {
        debug('enter put image route!');
        imageBLL.update(req, res, next);
    },
    'post /images': function (req, res, next) {
        debug('enter create image route!');
        imageBLL.create(req, res, next);
    },
    'delete /images/:imageId([0-9]+)': function (req, res, next) {
        debug('enter delete image route!');
        imageBLL.destroy(req, res, next);
    }
};