const router = require('express').Router();
const { body } = require('express-validator/check');

const feedController = require('../controllers/post');
const { isAuth, isInRole } = require('../middleware/is-auth');

router.get('/all', feedController.getPosts);

router.post('/create', isAuth, [
  body('title')
    .trim()
    .not().isEmpty()
    .isLength({ min: 5 })
    .withMessage('Please enter a valid title- minimum 5 chararcters.'),
  body('content')
    .trim()
    .not().isEmpty()
    .isLength({ min: 50 })
    .withMessage('Please enter a valid content- minimum 50 chararcters.'),
], 
feedController.postCreatePost);

router.get('/:postId', feedController.getPostById);
router.put('/update/:postId', isAuth || isInRole('Admin'), feedController.updatePost);
router.delete('/delete/:postId', isAuth || isInRole('Admin'), feedController.deletePost);

module.exports = router;