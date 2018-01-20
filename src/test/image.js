const shttp = require('net-helper').shttp;
const assert = require('assert');
const config = require('../API/configs/').site;
const url_prefix = `http://localhost:${config.port}`;
let authorization = '', new_id;

describe('mocha:image', function () {

    it('list()', function (done) {
        shttp
            .get(`${url_prefix}/images`)
            .type('json')
            .end()
            .then(function (res) {
                console.log(res, '***success***');
                assert.equal(res.status, true);
                done();
            })
            .catch(function (err) {
                console.log((err), '**fail***');
                done();
            });
    });
    it('show()', function (done) {
        shttp
            .get(`${url_prefix}/images/1000000`)
            .end()
            .then(function (res) {
                assert.equal(res.status, true);
                console.log(res, '***success***');
                done();
            })
            .catch(function (err) {
                console.log(Object.keys(err), '**fail***');
                done();
            });
    });
    it('update()', function (done) {
        shttp
            .put(`${url_prefix}/images/1000000`)
            .send({
                time: Date.now()
            })
            .end()
            .then(function (res) {
                assert.equal(res.status, true);
                console.log(res, '***success***');
                done();
            })
            .catch(function (err) {
                console.log(Object.keys(err), '**fail***');
                console.log(err.response.body);
                done();
            });
    });

    it('create()', function (done) {
        shttp
            .post(`${url_prefix}/images`)
            .type('json')
            .send({
                filename: 'test.png',
                path: 'upload/images/',
                uid: 1,
                size: 123,
                md5: '100c2c9d9937d117b8e398a1ecd852222017c2d6',
                time: Date.now()
            })
            .end()
            .then(function (res) {
                console.log(res, '***success***');
                //assert.equal(res.status, true);
                new_id = res.result.id;
                done();
            })
            .catch(function (err) {
                console.log(err, '**fail***');
                done();
            });
    });
    it('destroy()', function (done) {
        shttp
            .delete(`${url_prefix}/images/${new_id}`)
            .end()
            .then(function (res) {
                assert.equal(res.status, true);
                console.log(res, '***success***');
                done();
            })
            .catch(function (err) {
                console.log(Object.keys(err.response), '**fail***');
                done();
            });
    });
});