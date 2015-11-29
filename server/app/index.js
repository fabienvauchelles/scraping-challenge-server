'use strict';

const Persons = require('../model/person.model'),
    Router = require('koa-router');


module.exports = (config) => {
    const router = new Router();

    // Redirect
    router.redirect('/ch0', '/csv');
    router.redirect('/ch1', '/onepage');
    router.redirect('/ch2', '/pagination');
    router.redirect('/ch3', '/useragent');

    // CSV
    router.use('/csv', require('./csv')(config));

    // Onepage
    router.use('/onepage', require('./onepage')(config));

    // Pagination
    router.use('/pagination', require('./pagination')(config));

    // User agent (pagination + user agent)
    router.use('/useragent', require('../useragent')(config), require('./pagination')(config));

    // Get
    router.get('/', function * (next) {
        yield this.render('index', {
            title: 'Home'
        });

        yield next;
    });

    return router.routes();
};
