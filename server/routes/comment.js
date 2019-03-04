const router = require('express').Router();
const { body } = require('express-validator/check');

const commentController = require('../controllers/comment');
const { isAuth, isInRole } = require('../middleware/is-auth');

router.post('/:postId/create',
    [
        body('content')
        .trim()
        .not().isEmpty()
		.isLength({ min: 10 })
		.withMessage('Please enter a valid content- minimum 10 chararcters.'),
    ],
isAuth, commentController.postCreateComment);

router.put('/update/:commentId',
    [
        body('content')
        .trim()
        .not().isEmpty()
        .isLength({  min: 10 })
        .withMessage('Please enter a valid content- minimum 10 chararcters.'),
    ],
isAuth || isInRole('Admin'), commentController.updateComment);

router.get('/get/:commentId', isAuth, commentController.getCommentById);
router.delete('/delete/:commentId', isAuth || isInRole('Admin'), commentController.deleteComment);

router.get('/pending', isInRole('Admin'), commentController.getPendingComments);
router.put('/approve/:commentId', isInRole('Admin'), commentController.approveComment);

module.exports = router;