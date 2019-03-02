const router = require('express').Router();
const { body } = require('express-validator/check');
const feedController = require('../controllers/post');
const { isAuth, isInRole } = require('../middleware/is-auth');

router.get('/all', isAuth, feedController.getPosts);
router.post('/create', isAuth, [
  body('title')
    .trim()
    .isLength({ min: 5 }),
  body('content')
    .trim()
    .isLength({ min: 5 })
], feedController.createPost);
router.get('/:postId', isAuth,feedController.getPostById);
router.put('/update/:postId', isAuth,feedController.updatePost);
router.delete('/delete/:postId', isAuth,feedController.deletePost);

module.exports = router;