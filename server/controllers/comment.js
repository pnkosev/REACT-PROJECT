const { validationResult } = require('express-validator/check');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

function validateComment(req, res) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).json({
			success: false,
			message: 'Validation failed, entered data is incorrect',
			errors: errors.array()
		});

		return false;
	}
	return true;
}

module.exports = {
	postCreateComment: async (req, res, next) => {
		if (validateComment(req, res)) {
			const postId = req.params.postId;
			const { content } = req.body;

			const user = await User.findById(req.userId);
			
			let status = 'Pending';

			let isAdmin;
			if (user.roles.indexOf('Admin') !== -1) {
				status = 'Approved';
				isAdmin = true;
			}

			const comment = new Comment({
				content,
                creator: req.userId,
				post: postId,
				status,
            });
            
			return comment.save()
			.then(() => {
				return Promise.all([User.findById(req.userId), Post.findById(postId)]);
			})
			.then(([user, post]) => {
				user.comments.push(comment);
				post.comments.push(comment);
				return Promise.all([user.save(), post.save()]);
			})
			.then(() => {
				return Comment
						.findById(comment._id)
						.populate('creator', 'username _id')
			})
			.then((c) => {
				if (isAdmin) {
					res
					.status(201)
					.json({
						success: true,
						message: 'Comment created successfully!',
						comment: c,
					})
				} else {
					res
					.status(201)
					.json({
						success: true,
						message: 'Comment created successfully! It will be visible right after the approval of our Admins!',
						comment: c,
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
	getCommentById: (req, res, next) => {
		const commentId = req.params.commentId;

		Comment
			.findById(commentId)
			.then((comment) => {
				res
					.status(200)
					.json({
						success: true,
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
					
					if (comment.content === newComment.content) {
						const error = new Error('You didn\'t edit anything...');
                        error.statusCode = 422;
                        throw error;
					}
					
					if (user.roles.indexOf('Admin') < 0) {
						comment.status = 'Pending';
					} else {
						comment.status = 'Approved';
					}
					
					comment.content = newComment.content;

					return comment.save();
				})
				.then((comment) => {
					if (comment) {
						res.status(200).json({
							success: true,
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
						success: true,
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
			.populate('creator', 'username _id status')
            .then((comments) => {
                res
					.status(200)
					.json({
						success: true,
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
						success: true,
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