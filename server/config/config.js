module.exports = {
    development: {
        port: process.env.PORT || 9999,
        dbPath: 'mongodb://localhost:27017/react-blog-db',
        JWTSecret: 'tainaMaina'
    },
    production: {}
};