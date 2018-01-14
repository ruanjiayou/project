'use strict';

// model
const models = require('../models/index');

// lib
const _ = require('utils2/lib/_');
const Validator = require('utils2/lib/validator');
const DEBUG = require('debug')('APP:BLL_images');

async function findOrCreate(req, res, next) {
    // DEBUG('BLL find or create book method!');

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
    //     res.errors(new HinterError('validator', 'validate', err.message));
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
    // DEBUG('BLL create book method!');

    // const validator = new Validator({
    //     rules: {
    //         name: 'required|string|min:1',
    //         authorId: 'required|int',
    //         poster: 'nullable|string|min:1'
    //     }
    // });
    // const input = validator.filter(req.body);
    // try {
    //     validator.check(input);
    //     input.createdAt = Date.now();
    //     input.updatedAt = Date.now();
    // } catch (err) {
    //     return next(err);
    // }
    // const t = await models.sequelize.transaction();
    // try {
    //     let result = await models.User.findOne({ where: { id: input.authorId, roleId: 2 } });
    //     if (_.isNil(result)) {
    //         throw new HinterError('author', 'notFound');
    //     }
    //     // authorId name 
    //     result = await models.Book.findOne({ where: { name: input.name, authorId: input.authorId } }, { transaction: t });
    //     if (_.isNil(result)) {
    //         result = await models.Book.create(input, {
    //             transaction: t
    //         });
    //     } else {
    //         throw new HinterError('book', 'exists');
    //     }
    //     await t.commit();
    //     res.return(result);
    // } catch (err) {
    //     await t.rollback();
    //     next(err);
    // }
}

async function list(req, res, next) {
    DEBUG('BLL images list method!');
    req.paging();

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
        const filter = {
            where: {},
            limit: req.query.limit,
            offset: (req.query.page - 1) * 50
        };
        const scopes = [];
        let result = await models.Images.scope(scopes).findAndCountAll(filter);
        return res.paging(result, req.query);
    } catch (err) {
        return next(err);
    }
}

async function show(req, res, next) {
    DEBUG('BLL images show method!');

    const validator = new Validator({
        rules: {
            imageId: 'required|int'
        }
    });
    const input = validator.filter(req.params);
    try {
        validator.check(input);
    } catch (err) {
        res.errors(err);
    }

    try {
        const filter = {
            where: {
                id: input.bookId
            }
        };
        const scopes = [];
        const result = await models.Images.scope(scopes).findOne(filter);
        if (_.isNil(result)) {
            throw new HinterError('images', 'notFound');
        }
        return res.return(result);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    // DEBUG('BLL book update method!');

    // const validator = new Validator({
    //     rules: {
    //         id: 'required|int',
    //         authorId: 'nullable|int',
    //         count: 'nullable|int',
    //         name: 'nullable|string|min:1',
    //         poster: 'nullable|string',
    //         description: 'nullable|string',
    //         status: 'nullable|in:ing, end',
    //         isApproved: 'nullable|boolean'
    //     }
    // });
    // const input = validator.filter(req.body);
    // try {
    //     validator.check(input);
    // } catch (err) {
    //     return next(err);
    // }
    // try {
    //     const filter = { 
    //         where: {
    //             id: input.id
    //         } 
    //     };
    //     const book = await models.Book.findOne({
    //         where: {
    //             id: input.id
    //         }
    //     });
    //     if (_.isNil(book)) {
    //         throw new HinterError('book', 'notFound');
    //     }
    //     await models.Book.update(input, filter);
    //     req.params.id = book.id;

    //     show(req, res, next);
    // } catch (err) {
    //     next(err);
    // }
}

async function destroy(req, res, next) {
    // try {
    //     let book = await models.Book.findOne({ where: { id: req.params.bookId } });
    //     if (!_.isNil(book)) {
    //         book.destroy();
    //         res.return();
    //     } else {
    //         throw new HinterError('book', 'notFound');
    //     }
    // } catch (err) {
    //     next(err);
    // }

}

async function uploadPoster(req, res, next) {
    // console.log(req.files);
    // res.return({ status: 'endd' });
}

async function down(req, res, next) {
    // DEBUG('BLL book down() method!');
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
    uploadPoster,
    destroy,
    down
};