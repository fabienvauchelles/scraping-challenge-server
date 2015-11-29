'use strict';

const _ = require('lodash'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    Person = require('../../server/model/person.model'),
    readline = require('readline'),
    stream = require('stream'),
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
    const instream = fs.createReadStream(config.data.path);
    instream.on('error', (err) => winston.error('[Stream] Error: ', err));
    instream.on('end', () => {
        //mongoose.disconnect();
    });

    const rl = readline.createInterface({
        input: instream,
        terminal: false,
    });

    rl.on('line', (data) => {
        const parsed = JSON.parse(data);

        rl.pause();

        let person;
        try {
            person = new Person(parsed);
            person.save((err) => {
                if (err) return winston.error('[Mongoose] Error: ', err);

                winston.debug('%s saved.', person.given_name);

                rl.resume();
            });
        }
        catch (err) {
            winston.error('[Mongoose/Validation] Error: ', err);
        }
    });
});

