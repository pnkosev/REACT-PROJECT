module.exports = {
    development: {
        port: process.env.PORT || 3000,
        dbPath: 'mongodb://localhost:27017/react-blog-db',
        JWTSecret: 'tainaMaina'
    },
    production: {}
};