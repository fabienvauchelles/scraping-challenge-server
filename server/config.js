module.exports = {
    port: process.env.PORT || 9000,

    mongo: {
        url: process.env.MONGOLAB_URI || 'mongodb://localhost/scraping-challenge',
    },

    assets: {
        path: 'assets',
    },

    template: {
        viewPath: 'app',
        defaultLayout: 'template/index.tpl',
    },

    pagination: {
        size: 10,
    },
};
