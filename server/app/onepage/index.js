'use strict';

const Person = require('../../model/person.model'),
    Router = require('koa-router');


module.exports = (config) => {
    const router = new Router();

    // Get
    router.get('/', function * (next) {
        const persons = yield Person
            .find()
            .sort({
                given_name: 1,
                family_name: 1,
            });

        yield this.render('onepage/index', {
            title: 'One page',
            persons: persons,
        });

        yield next;
    });

    return router.routes();
};
