module.exports = {
    port: process.env.PORT || 9000,

    mongo: {
        url: 'mongodb://localhost/scraping-challenge'
    },

    template: {
        viewPath: 'app',
        defaultLayout: 'template/index.tpl',
    },
};
