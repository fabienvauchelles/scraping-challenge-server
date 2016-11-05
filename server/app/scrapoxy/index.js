'use strict';

const antiIP = require('./anti-ip'),
    Person = require('../../model/person.model'),
    Router = require('koa-router'),
    winston = require('winston');


module.exports = (config) => {
    const router = new Router();

    // Get
    router.get('/', antiIP, function * (next) {
        const page = parseInt(this.query.page || 0),
            num = page * config.pagination.size;

        const count = yield Person.count();

        if (num < 0 || num >= count) {
            this.body = 'Out of range';
            this.status = 404;
            return;
        }

        const persons = yield Person
            .find()
            .sort({
                given_name: 1,
                family_name: 1,
            })
            .skip(num)
            .limit(config.pagination.size);

        const opts = {
            title: 'Scrapoxy',
            persons: persons,
            min: page * config.pagination.size,
            max: Math.min(count, (page + 1) * config.pagination.size),
            count: count,
        };

        const pageMax = Math.floor(count / config.pagination.size);

        if (page > 0) {
            opts.pageMin = page - 1;
        }

        if (page < pageMax) {
            opts.pagePlus = page + 1;
        }

        yield this.render('scrapoxy/index', opts);

        yield next;
    });

    return router.routes();
};
