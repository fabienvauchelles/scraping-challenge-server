'use strict';

const winston = require('winston');

const config = require('../../config');

const ips = new Map();

module.exports = function * (next) {
    const page = parseInt(this.query.page || 0);
    if (page === 0) {
        yield next;
        return;
    }

    const ip = this.request.ip;

    let counter = ips.get(ip);
    if (counter) {
        if (counter.num <= 0) {
            yield this.render('scrapoxy-adv/ban', {
                title: 'Scrapoxy Advanced',
                ip,
            });
            this.status = 503;
            return;
        }
        else {
            --counter.num;
        }
    }
    else {
        //winston.info(`Add counter for IP ${ip}`);
        counter = {
            num: config.scrapoxy_adv.max_requests - 1,
        };
        ips.set(ip, counter);

        setTimeout(() => {
            //winston.info(`Remove counter for IP ${ip}`);
            ips.delete(ip);
        }, config.scrapoxy_adv.unban_delay);
    }

    yield next;
};
