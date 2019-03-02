const router = require('express').Router();
const languageController = require('../controllers/language');
const translationController = require('../controllers/translation');
const isAuth = require('../middleware/is-auth');

router.get('/language/all', languageController.getAllLanguages);
router.post('/language/create', languageController.postCreateLanguage);
//router.put('/language/update/:langId', languageController.updateLanguage);

router.get('/words', translationController.getAllWords);
router.get('/translation/allPending', translationController.getPendingTranslations);
router.post('/translation/create', isAuth, translationController.postCreateTranslation);
router.put('/translation/update/:transId', translationController.updateTranslation);
router.delete('/translation/delete/:transId', translationController.deleteTranslation);

module.exports = router;