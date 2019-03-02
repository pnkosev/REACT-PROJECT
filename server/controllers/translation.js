const Language = require('../models/Language');
const Word = require('../models/Word');

module.exports = {
    getAllWords: (req, res, next) => {
        const { originLang, translationLang } = req.body;

        Language
            .find({ name: originLang })
            .populate({ path: 'words', options: { translationLang: `${translationLang}`, sort: { 'word': 1 } } })
            .select('words')
            .then((language) => {
                const words = language.words;

                if (!words) {
                    const error = new Error('Currently no translations in the database.');
                    error.statusCode = 404;
                    throw error;
                }

                res
                    .status(200)
                    .json({ message: 'Fetched translations successfully.', words })
            })
            .catch((error) => {
                if (!error.statusCode) {
                    error.statusCode = 500;
                }

                next(error);
            });


    },
    getPendingTranslations: (req, res, next) => {
        Word
            .find({ status: 'Pending' })
            .then((words) => {
                if (!words) {
                    const error = new Error('Currently no \'Pending\' translations.');
                    error.statusCode = 404;
                    throw error;
                }

                res
                    .status(200)
                    .json({ message: 'Fetched \'Pending\' translations successfully.', words })
            })
            .catch((error) => {
                if (!error.statusCode) {
                    error.statusCode = 500;
                }

                next(error);
            });
    },
    postCreateTranslation: (req, res, next) => {
        const { word, originLang, translationLang, translation } = req.body;
        const creator = req.userId;

        const word = new Word({
            word,
            originLang,
            creator
        });
        word.translationLangs.push(translationLang);
        word.translations.push(translation);

        word
            .save()
            .then((word) => {
                
            })

    },
    updateTranslation: (req, res, next) => {

    },
    deleteTranslation: (req, res, next) => {

    }
}