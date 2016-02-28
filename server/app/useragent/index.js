'use strict';

const Person = require('../../model/person.model'),
    Router = require('koa-router');


module.exports = () => {
    const router = new Router();

    // Get
    router.get('/', checkUA, function * (next) {
        const persons = yield Person
            .find()
            .sort({
                given_name: 1,
                family_name: 1,
            });

        yield this.render('useragent/index', {
            title: 'User agent',
            persons: persons,
        });

        yield next;
    });

    return router.routes();
};


const validUA = /chrome/i;

function * checkUA(next) {
    const ua = this.request.headers['user-agent'] || '';

    if (!validUA.test(ua)) {
        this.body = 'Forget me, scraper. Only Chrome is allowed.'
        this.status = 503;
        return;
    }

    yield next;
}
