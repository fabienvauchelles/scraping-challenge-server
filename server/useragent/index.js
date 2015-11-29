module.exports = (config) => {
    const valid = /chrome/i;

    return function * (next) {
        const ua = this.request.headers['user-agent'] || '';

        if (!valid.test(ua)) {
            this.body = 'Forget me, scraper.'
            this.status = 503;
            return;
        }

        yield next;
    };
};
