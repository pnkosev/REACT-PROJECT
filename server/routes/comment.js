const router = require('express').Router();
const commentController = require('../controllers/comment');
const { isAuth, isInRole } = require('../middleware/is-auth');

router.post('/:postId/create', isAuth, commentController.postCreateComment);
router.get('/get/:commentId', isAuth, commentController.getCommentById);

router.put('/update/:commentId', isAuth || isInRole('Admin'), commentController.updateComment);
router.delete('/delete/:commentId', isAuth || isInRole('Admin'), commentController.deleteComment);

router.get('/pending', isInRole('Admin'), commentController.getPendingComments);
router.put('/approve/:commentId', isInRole('Admin'), commentController.approveComment);

module.exports = router;