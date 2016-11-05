'use strict';

const config = require('../../config');

module.exports = function * (next) {
    const ua = this.request.headers['user-agent'] || '';

    if (!config.useragent.pattern.test(ua)) {
        yield this.render('useragent/ban', {
            title: 'User agent',
        });
        this.status = 503;
        return;
    }

    yield next;
};
