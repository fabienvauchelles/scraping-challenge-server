'use strict';

const _ = require('lodash'),
    csv = require('fast-csv'),
    Person = require('../../model/person.model'),
    Router = require('koa-router');


module.exports = () => {
    const router = new Router();

    // Get
    router.get('/', function * (next) {
        yield this.render('csv/index', {
            title: 'CSV',
        });

        yield next;
    });

    // Get (export)
    router.get('/export', function * (next) {
        const stream = csv.createWriteStream({
            headers: true,
            quoteHeaders: true,
            quoteColumns: true,
        });
        this.type = 'text/csv';
        this.set('Content-Disposition', 'attachment; filename="persons.csv"');

        this.body = stream;
        this.status = 200;

        const persons = Person
            .find()
            .sort({
                given_name: 1,
                family_name: 1,
            })
            .stream();

        persons.on('error', (err) => {
            this.throw(500, err);
        });

        persons.on('close', () => stream.end());

        persons.on('data', (person) => {
            const personObj = _.omit(person.toObject(), ['_id']);

            stream.write(personObj)
        });
    });

    return router.routes();
};
