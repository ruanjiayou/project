const shttp = require('net-helper').shttp;
const assert = require('assert');
const config = require('../API/configs/loader').site;
const url_prefix = `http://localhost:${config.port}`;
let authorization = '', new_id;

describe('mocha:image', function () {

    it('list()', async function () {
        await shttp
            .get(`${url_prefix}/images`)
            .type('json')
            .end(function (err, res) {
                if (err) {
                    console.log(err.message);
                } else {
                    console.log(res, '***success***');
                    assert.equal(res.status, true);
                }

            });
    });
    it('show()', async function () {
        await shttp
            .get(`${url_prefix}/images/1000000`)
            .end(function (err, res) {
                if (err) {
                    console.log(err.message);
                }
                assert.equal(res.status, true);
                console.log(res, '***success***');
            });
    });
    it('update()', async function () {
        await shttp
            .put(`${url_prefix}/images/1000000`)
            .send({
                time: Date.now()
            })
            .end(function (err, res) {
                if (err) {
                    console.log(err.message);
                } else {
                    assert.equal(res.status, true);
                    console.log(res, '***success***');
                }

            });
    });

    it('create()', async function () {
        await shttp
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
            .end(function (err, res) {
                if (err) {
                    console.log(err.message);
                } else {
                    console.log(res, '***success***');
                    //assert.equal(res.status, true);
                    new_id = res.result.id;
                }

            });
    });
    it('destroy()', async function () {
        await shttp
            .delete(`${url_prefix}/images/${new_id}`)
            .end(function (err, res) {
                if (err) {
                    console.log(err.message);
                } else {
                    assert.equal(res.status, true);
                    console.log(res, '***success***');
                }

            });
    });
});