const shttp = require('net-helper').shttp;
const assert = require('assert');
const config = require('../API/configs/').site;
const url_prefix = `http://localhost:${config.port}`;
let authorization = '';

describe('mocha:user', function () {
    it('sign-up', function (done) {
        shttp
            .post(`${url_prefix}/auth/user/sign-up`)
            .send({
                email: '2240844515@qq.com',
                password: 'e10adc3949ba59abbe56e057f20f883e',
                birth: '1993-01-01 00:00:00',
                name: 'ruanjiayou',
                //status: activing
                //gender: m
                //isApproved: false

            })
            .end()
            .then(function (res) {
                console.log(res);
                done();
            })
            .catch(function (err) {
                console.log(err.message);
                done();
            });
    });
    it('sign-in', function (done) {
        shttp
            .post(`${url_prefix}/auth/user/sign-in`)
            .send({
                account: '1439120442@qq.com',
                // 123456 -> md5
                password: 'e10adc3949ba59abbe56e057f20f883e'
            })
            .end()
            .then(function (res) {
                console.log(res);
                assert.equal('JWT', res.result.type);
                authorization = `${res.result.type} ${res.result.token}`;
                done();
            })
            .catch(function (err) {
                console.log(err.body);
                done();
            });
    });
    it('user/self(测试auth)', function (done) {
        shttp
            .get(`${url_prefix}/user/self`)
            .set({
                authorization: authorization
            })
            .end()
            .then(function (res) {
                console.log(res);
                assert.equal(true, res.status);
                assert.equal('1', res.result.id);
                done();
            })
            .catch(function (err) {
                console.log(err.message);
                done();
            });
    });
});