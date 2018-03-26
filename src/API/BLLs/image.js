'use strict';

// model
const models = global.$models;

// lib
const _ = require('lodash');
const Validator = global.$libs.validator;
const debug = require('debug')('APP:BLL_image');

async function findOrCreate(req, res, next) {
    // debug('BLL find or create book method!');

    // const validator = new Validator({
    //     rules: {
    //         name: 'required|string|min:1',
    //         authorId: 'required|int'
    //     }
    // });
    // const input = validator.filter(req.body);
    // try {
    //     validator.check(input);
    // } catch (err) {
    //     res.customError(new HinterError('validator', 'validate', err.message));
    // }

    // try {
    //     let result = await models.Book.findOne({ where: input });
    //     if (_.isNil(result)) {
    //         create(req, res, next);
    //     } else {
    //         res.return(result);
    //     }
    // } catch (err) {
    //     next(err);
    // }
}

async function create(req, res, next) {
    debug('BLL create image method!');

    const validator = new Validator({
        rules: {
            filename: 'required|string|min:1',
            path: 'required|string',
            size: 'required|int|min:0',
            md5: 'required|string|length:32',
            time: 'required|date'
        }
    });
    const input = validator.filter(req.body);
    try {
        validator.check(input);
    } catch (err) {
        return next(err);
    }
    const t = await models.sequelize.transaction();
    try {
        const filter = {
            where: {
                size: input.size,
                md5: input.md5
            }
        };
        // authorId name 
        let result = await models.Image.findOne(filter, { transaction: t });
        if (_.isNil(result)) {
            result = await models.Image.create(input, {
                transaction: t
            });
        } else {
            throw new HinterError('common', 'exists');
        }
        await t.commit();
        res.return(result);
    } catch (err) {
        await t.rollback();
        next(err);
    }
}

async function list(req, res, next) {
    debug('BLL image list method!');
    const filter = req.paging();

    const validator = new Validator({
        rules: {}
    });
    const input = validator.filter(req.query);
    try {
        validator.check(input);
    } catch (err) {
        return next(err);
    }
    try {
        const scopes = [];
        let result = await models.Image.scope(scopes).findAndCountAll(filter);
        return res.paging(result, req.query);
    } catch (err) {
        return next(err);
    }
}

async function show(req, res, next) {
    debug('BLL image show method!');

    const validator = new Validator({
        rules: {
            imageId: 'required|int'
        }
    });
    const input = validator.filter(req.params);
    try {
        validator.check(input);
    } catch (err) {
        return next(err);
    }

    try {
        const filter = {
            where: {
                id: input.imageId
            }
        };
        const scopes = [];
        const result = await models.Image.scope(scopes).findOne(filter);
        if (_.isNil(result)) {
            throw new HinterError('image', 'notFound');
        }
        return res.return(result);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    debug('BLL image update method!');

    const validator = new Validator({
        rules: {
            //id: 'nullable|int',
            filename: 'nullable|string',
            path: 'nullable|string',
            size: 'nullable|int|min:0',
            md5: 'nullable|string|length:32',
            time: 'nullable|date',
        }
    });
    const input = validator.filter(req.body);
    try {
        validator.check(input);
    } catch (err) {
        return next(err);
    }
    try {
        const filter = {
            where: {
                id: req.params.imageId
            }
        };
        const image = await models.Image.findOne(filter);
        if (_.isNil(image)) {
            throw new HinterError('image', 'notFound');
        }
        const result = await image.update(input);
        res.return(result);
    } catch (err) {
        next(err);
    }
}

async function destroy(req, res, next) {
    debug('enter image destroy method!');
    try {
        const filter = {
            where: {
                id: req.params.imageId
            }
        };
        const image = await models.Image.findOne(filter);
        if (!_.isNil(image)) {
            const result = await image.destroy();
            res.return(result);
        } else {
            throw new HinterError('image', 'notFound');
        }
    } catch (err) {
        next(err);
    }
}

async function upload(req, res, next) {
    debug('enter image upload method!');
    // res.return({ status: 'endd' });
}

async function down(req, res, next) {
    // debug('BLL book down() method!');
    // let book = await models.Book.findOne({ where: { id: req.params.bookId } });
    // let result = await models.Chapter.findAll({ attributes: ['title', 'content'], order: [['id', 'ASC']], where: { bookId: book.id } });
    // if (!_.isNil(result) && !_.isNil(book)) {
    //     res.set('content-type', 'text/plain; charset=utf-8');
    //     res.set('Content-disposition', `attachment; filename*=utf-8''${encodeURIComponent(book.name)}`);
    //     let txt = '';
    //     for (let i = 0; i < result.length; i++) {
    //         txt += `${result[i].title}\n${result[i].content}`;
    //     }
    //     txt = txt.replace(/&nbsp;/g, ' ').replace(/(<[/]?br[/]?>)|(<[/]?p>)/g, '\n');
    //     res.write(txt);
    //     res.end();
    // } else {
    //     next();
    // }
}

module.exports = {
    findOrCreate,
    list,
    show,
    create,
    update,
    upload,
    destroy,
    down
};