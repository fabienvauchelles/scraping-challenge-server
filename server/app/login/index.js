'use strict';

const Person = require('../../model/person.model'),
    jwt = require('jsonwebtoken'),
    Router = require('koa-router');


module.exports = (config) => {
    const router = new Router();

    // Get
    router.get('/', checkAuth, function * (next) {
        const persons = yield Person
            .find()
            .sort({
                given_name: 1,
                family_name: 1,
            });

        yield this.render('login/index', {
            title: 'Login',
            persons: persons,
        });

        yield next;
    });


    // Get (login)
    router.get('/form', function * (next) {
        yield this.render('login/form', {
            title: 'Login',
        });

        yield next;
    });


    // Post (login)
    router.post('/auth', function *() {
       const auth = this.request.body;

        if (auth.email === 'john@doe.com' &&
            auth.password == 'johnjohn'
        ) {
            const token = sign({
                email: auth.email,
            });

            this.cookies.set('token', token);

            return this.redirect('/login');
        }
        else {
            return this.redirect('/login/form');
        }
    });


    // Get (logout)
    router.get('/logout', function * () {
        this.cookies.set('token', 'wrong token');

        return this.redirect('/login');
    });

    return router.routes();


    ////////////

    function sign(payload) {
        return jwt.sign(payload, config.jwt.secret, {
            algorithm: 'HS256',
            expiresIn: config.jwt.expiresIn,
        });
    }

    function * checkAuth(next) {
        const token = this.cookies.get('token');

        try {
            yield verifyToken(token);

            yield next;
        }
        catch (err) {
            if (err.name === 'JsonWebTokenError' ||
                err.name === 'TokenExpiredError') {
                return this.redirect('/login/form');
            }

            this.throw(err, 500);
        }


        ////////////

        function verifyToken(tk) {
            return new Promise((resolve, reject) => {
                jwt.verify(tk, config.jwt.secret, (err, decoded) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(decoded);
                });
            });
        }
    }
};
