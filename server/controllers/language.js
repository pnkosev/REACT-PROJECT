const Language = require('../models/Language');
const Translation = require('../models/Word');

module.exports = {
    getAllLanguages: (req, res, next) => {
        Language
            .find()
            .then((languages) => {
                if (!languages) {
                    const error = new Error('No languages in the DB atm!');
                    error.statusCode = 404;
                    throw error;
                }
                res
                    .status(200)
                    .json({ message: 'Fetched languages successfully.', languages })
            })
            .catch((error) => {
                if (!error.statusCode) {
                    error.statusCode = 500;
                }

                next(error);
            });
    },
    postCreateLanguage: (req, res, next) => {
        const { name } = req.body;

        Language
            .findOne({name})
            .then((find) => {
                if (find) {
                    const error = new Error('Language already exists');
                    error.statusCode = 409;
                    throw error;
                }

                Language
                    .create({
                        name,
                        words: []
                    })
                    .then(() => {
                        res
                            .status(201)
                            .json({ message: 'Language created successfully!' });
                    })
            })
            .catch((error) => {
                if (!error.statusCode) {
                    error.statusCode = 500;
                }

                next(error);
            })
        
    },
    getRelatedLanguages: (req, res, next) => {
        
    },
    // updateLanguage: (req, res, next) => {

    // }
}