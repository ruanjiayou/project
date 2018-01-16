// models
const models = require('../models/');
// libs
const _ = require('utils2/lib/_');
const debug = require('debug')('APP:BLL_USER');
const Validator = require('utils2/lib/validator');

async function list(req, res, next) {
    debug('enter user list method!');
    req.paging();

    const validator = new Validator({
        rules: {
            name: 'nullable|string',
            email: 'nullable|email',
            status: 'nullable|string|in:activing,using,destroy',
            country: 'nullable|int',
            isApproved: 'nullable|boolean',
            gender: 'nullable|string|in:m,f',
            birth: 'nullable|date'
        }
    });
    const input = validator.filter(req.query);
    try {
        validator.check(input);
    } catch (err) {
        return res.errors(err);
    }
    try {
        const filter = {};
        const scopes = [];
        const result = await models.User.scope(scopes).findAndCountAll(filter);
        res.paging(result, req.query);
    } catch (err) {
        next(err);
    }
}

async function show(req, res, next) {
    debug('enter user show method!');

    try {
        const filter = {
            where: {
                id: req.params.userId
            }
        };
        const scopes = [];
        const result = await models.User.scope(scopes).findOne(filter);
        if (_.isNil(result)) {
            throw new HinterError('user', 'notFound');
        }
        return res.return(result);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    debug('enter user update method!');
    const validator = new Validator({
        rules: {
            id: 'required|int',
            email: 'nullable|email',
            name: 'nullable|string',
            avatar: 'nullable|string',
            description: 'nullable|string',
            status: 'nullable|string|in:activing,using,destroyed',
            country: 'nullable|int',
            isApproved: 'nullable|boolean'
        }
    });
    const input = validator.filter(req.params);
    try {
        validator.check(input);
    } catch (err) {
        return res.errors(err);
    }
    try {
        const filter = {
            where: {
                id: input.id
            }
        };
        const result = await models.User.update(input, filter);
        res.return(result);
    } catch (err) {
        next(err);
    }
}

async function destroy(req, res, next) {
    debug('enter user destroy method!');
    const validator = new Validator({
        rules: {
            userId: 'required|int'
        }
    });
    const input = validator.filter(req.params);
    try {
        validator.check(input);
    } catch (err) {
        return res.errors(err);
    }
    try {
        const filter = {
            where: {
                id: input.userId
            }
        };
        const result = await models.User.destroy(filter);
        res.return(result);
    } catch (err) {
        next(err);
    }
}

async function uploadAvatar(req, res, next) {
    debug('enter user uploadAvatar method!');
    next();
}
module.exports = {
    list,
    show,
    update,
    destroy,
    uploadAvatar
};