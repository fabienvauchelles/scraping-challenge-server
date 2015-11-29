'use strict';

const Router = require('koa-router');


module.exports = (config) => {
    const router = new Router();

    // Get
    router.get('/', function * (next) {
        yield this.render('index', {
            name: 'toto'
        });

        yield next;
    });

    return router.routes();
};
