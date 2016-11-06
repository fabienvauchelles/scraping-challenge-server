'use strict';

const antiUA = require('./anti-ua'),
    Person = require('../../model/person.model'),
    Router = require('koa-router');


module.exports = () => {
    const router = new Router();

    // Get
    router.get('/', antiUA, function * (next) {
        const persons = yield Person
            .find()
            .sort({
                given_name: 1,
                family_name: 1,
            });

        yield this.render('useragent/index', {
            title: 'User Agent',
            persons: persons,
        });

        yield next;
    });

    return router.routes();
};
