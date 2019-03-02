const { validationResult } = require('express-validator/check');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

function validateComment(req, res) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).json({
			message: 'Validation failed, entered data is incorrect',
			errors: errors.array()
		});

		return false;
	}
	return true;
}

module.exports = {
	postCreateComment: (req, res, next) => {
		// Validate post using express-validator
		// Return 422 with errors array if something went wrong
		if (validateComment(req, res)) {
            const postId = req.params.postId;
			const { content } = req.body;

			// Create the post in DB and return 201 status code with a message and the post itself with the creator
			const comment = new Comment({
				content,
                creator: req.userId,
                post: postId,
            });
            
			comment.save()
				.then(() => {
					return Promise.all([User.findById(req.userId), Post.findById(postId)]);
				})
				.then(([user, post]) => {
                    user.comments.push(comment);
                    post.comments.push(comment);
					return Promise.all([user.save(), post.save()]);
                })
				.then(() => {
					res
						.status(201)
						.json({
							message: 'Comment created successfully!',
							comment: comment,
						})
				})
				.catch((error) => {
					if (!error.statusCode) {
						error.statusCode = 500;
					}

					next(error);
				});
		}
	},
	getCommentById: (req, res, next) => {
		const commentId = req.params.commentId;

		Comment
			.findById(commentId)
			.then((comment) => {
				res
					.status(200)
					.json({
						message: 'Comment fetched.',
						comment
					})
			})
			.catch((error) => {
				if (!error.statusCode) {
					error.statusCode = 500;
				}

				next(error);
			});
	},
	updateComment: (req, res, next) => {
		// Validate post using express-validator
		// Return 422 with errors array if something went wrong
		if (validateComment(req, res)) {
			const commentId = req.params.commentId;
			const newComment = req.body;

            Comment
                .findById(commentId)
				.then(async (comment) => {
					if (!comment) {
						const error = new Error('Comment not found');
						error.statusCode = 404;
						throw error;
					}

					const user = await User.findById(req.userId);

                    if ((comment.creator.toString() !== req.userId) && (user.roles.indexOf('Admin') < 0)) {
                        const error = new Error('Unauthorized');
                        error.statusCode = 403;
                        throw error;
                    }
                    
					comment.content = newComment.content;

					return comment.save();
				})
				.then((comment) => {
					if (comment) {
						res.status(200).json({
							message: 'Comment updated!',
							comment
						})
					}
				})
				.catch((error) => {
					if (!error.statusCode) {
						error.statusCode = 500;
					}
					next(error);
				});
		}
    },
    deleteComment: (req, res, next) => {
		const commentId = req.params.commentId;

        Comment
            .findById(commentId)
			.populate('post')
			.populate('creator')
			.then(async (comment) => {
				if (!comment) {
					const error = new Error('Comment not found!');
					error.statusCode = 404;
					throw error;
                }
                
				const user = await User.findById(req.userId);

				if ((comment.creator._id.toString() !== req.userId) && (user.roles.indexOf('Admin') < 0)) {
					const error = new Error('Unauthorized');
					error.statusCode = 403;
					throw error;
                }
                
                const post = await Post.findById(comment.post);
                comment.creator.comments.pull(commentId);
                post.comments.pull(commentId);

				return Promise.all([
					Comment.findByIdAndDelete(commentId),
                    comment.creator.save(),
                    post.save(),
				]);
			})
			.then(() => {
				res.status(200)
					.json({
						message: 'Comment deleted successfully!'
					})
			})
			.catch((error) => {
				if (!error.statusCode) {
					error.statusCode = 500;
				}

				next(error);
			});
    },
    getPendingComments: (req, res, next) => {
        Comment
            .find()
            .where('status', 'Pending')
            .then((comments) => {
                res
					.status(200)
					.json({
						message: 'Comments fetched.',
						comments
					})
            })
            .catch((error) => {
                if (!error.statusCode) {
                    error.statusCode = 500;
                }

                next(error);
            });
    },
    approveComment: (req, res, next) => {
        const commentId = req.params.commentId;

        Comment
            .findById(commentId)
            .then((comment) => {
                if (!comment) {
                    const error = new Error('Comment not found');
                    error.statusCode = 404;
                    throw error;
                }
                comment.status = 'Approved';
                return comment.save();
            })
            .then((comment) => {
                res
                    .status(200)
                    .json({
                        message: 'Comment approved!',
                        comment
                })
            })
            .catch((error) => {
                if (!error.statusCode) {
                    error.statusCode = 500;
                }

                next(error);
            });
    }
}