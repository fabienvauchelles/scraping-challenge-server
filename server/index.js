/**
 * MAIN: Configuration and main application
 */

const compress = require('koa-compress'),
    errorHandler = require('koa-error'),
    hbs = require('koa-hbs'),
    Koa = require('koa'),
    logger = require('koa-logger'),
    moment = require('moment'),
    mongoose = require('mongoose'),
    Router = require('koa-router'),
    winston = require('winston');


const config = require('./config');


// Logging
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {timestamp: true});
winston.add(winston.transports.File, {
    filename: `../log/save_downloaded_${moment().format('YYYYMMDD_HHmmss')}.log`,
    json: false,
    timestamp: true,
});
winston.level = 'debug';


// Connect to database
mongoose.connect(config.mongo.url);
mongoose.connection.on('error', (err) => {
    winston.error('Mongoose error: ', err);
    process.exit(1);
});


// Configure KOA framework
const app = new Koa();
app.name = 'Scraping challenge server';

if (config.debug) {
    app.use(logger());
}

app.use(errorHandler());
app.use(compress());
app.use(hbs.middleware(config.template));


// Define routes
const router = new Router();

router.use('/', require('./app')(config));

app.use(router.routes());


// Start server
app.listen(config.port);
winston.info('%s server listening at http://localhost:%d', app.name, config.port);


module.exports = app;
