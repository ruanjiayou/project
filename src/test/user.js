const shttp = require('net-helper').shttp;
const assert = require('assert');
const config = require('../API/configs/loader').site;
const url_prefix = `http://localhost:${config.port}`;
let authorization = '';

describe('mocha:user', function () {
    it('sign-up', async function () {
        await shttp
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
            .end(function (err, res) {
                if (err) {
                    console.log(err.message);
                } else {
                    console.log(res);
                }
            });
    });
    it('sign-in', async function () {
        await shttp
            .post(`${url_prefix}/auth/user/sign-in`)
            .send({
                account: '1439120442@qq.com',
                // 123456 -> md5
                password: 'e10adc3949ba59abbe56e057f20f883e'
            })
            .end(function (err, res) {
                if (err) {
                    console.log(err.message);
                } else {
                    console.log(res);
                    authorization = `${res.result.type} ${res.result.token}`;
                }
            });
    });
    it('users/self(测试auth)', async function () {
        await shttp
            .get(`${url_prefix}/users/self`)
            .set({
                authorization: authorization
            })
            .end(function (err, res) {
                if (err) {
                    console.log(err.message);
                } else {
                    console.log(res);
                    assert.equal(true, res.status);
                    assert.equal('1', res.result.id);
                }
            });
    });
    it('users(测试findAndCountAll())', async function () {
        await shttp
            .get(`${url_prefix}/users`)
            .end(function (err, res) {
                if (err) {
                    console.log(err.message);
                } else {
                    console.log(res);
                }
            });
    });
});