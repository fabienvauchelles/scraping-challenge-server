'use strict';

const _ = require('lodash'),
    PromiseBB = require('bluebird'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    Person = require('../../server/model/person.model'),
    winston = require('winston');

const config = _.merge(
    require('../../server/config'),
    require('./config')
);


// Logging
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {timestamp: true});
winston.level = 'debug';


// Connect to database
mongoose.connect(config.mongo.url);
mongoose.connection.on('error', (err) => {
    winston.error('Mongoose error: ', err);
    process.exit(1);
});


// Remove all data
Person.remove({}, (err) => {
    if (err) return winston.error('[Mongoose] Error: ', err);

    // Add insert new data

    // Read source file
    fs.readFile(config.data.path, (err, data) => {
        if (err) return winston.error('[File] Error: ', err);

        const lines = data.toString().split('\n');

        const persons = _(lines)
            .take(config.max)
            .map((line) => JSON.parse(line))
            .value();

        let count = 0;
        PromiseBB.map(
            persons,
            (person) => Person
                .create(person)
                .then(() => {
                    winston.debug('[%d] %s saved.', count++, person.given_name);
                })
            ,
            {
                concurrency: 1,
            });
    });
});

