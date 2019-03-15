const { validationResult } = require('express-validator/check');
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');

function validatePost(req, res) {
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
	getApprovedPosts: (req, res, next) => {
		Post
			.find()
			.where('status', 'Approved')
			.populate('creator', 'username _id')
			.then((posts) => {
				res
					.status(200)
					.json({
						success: true,
						message: 'Fetched posts successfully.',
						posts
					});
			})
			.catch((error) => {
				if (!error.statusCode) {
					error.statusCode = 500;
				}

				next(error);
			});
	},
	getPendingPosts: (req, res, next) => {
		Post
			.find()
			.where('status', 'Pending')
			.populate('creator', 'username _id')
			.then((posts) => {
				res
					.status(200)
					.json({
						success: true,
						message: 'Fetched posts successfully.',
						posts
					});
			})
			.catch((error) => {
				if (!error.statusCode) {
					error.statusCode = 500;
				}

				next(error);
			});
	},
	postCreatePost: (req, res, next) => {
		if (validatePost(req, res)) {
			const { title, content, imageUrl } = req.body;

			const post = new Post({
				title,
				content,
				imageUrl,
				creator: req.userId
			});

			post.save()
				.then(() => {
					return User.findById(req.userId);
				})
				.then((user) => {
					user.posts.push(post);
					return user.save();
				})
				.then(() => {
					res
						.status(201)
						.json({
							success: true,
							message: 'Post created successfully! Needs approval though...',
							post: post,
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
	deletePost: (req, res, next) => {
		const postId = req.params.postId;

		Post
			.findById(postId)
			.then(async (post) => {
				if (!post) {
					const error = new Error('Post not found!');
					error.statusCode = 404;
					throw error;
				}

				const user = await User.findById(req.userId);

				if ((post.creator.toString() !== req.userId) && (user.roles.indexOf('Admin') < 0)) {
					const error = new Error('Unauthorized');
					error.statusCode = 403;
					throw error;
				}

				return Promise.all([
					Post.findByIdAndDelete(postId),
					Comment.deleteMany({post: postId}),
					User.findById(post.creator)
				]);
			})
			.then(([p, c, u]) => {
				u.posts.pull(p._id);
				return u.save();
			})
			.then(() => {
				res.status(200)
					.json({
						success: true,
						message: 'Post deleted successfully!'
					})
			})
			.catch((error) => {
				if (!error.statusCode) {
					error.statusCode = 500;
				}

				next(error);
			});
	},
	getPostById: (req, res, next) => {
		const postId = req.params.postId;

		Post
			.findById(postId)
			.populate({
				path: 'comments',
				match: { status:  'Approved' },
				populate: {
					path: 'creator'
				}
			})
			.populate('likes', 'username _id')
			.populate('hates', 'username _id')
			.populate('creator', 'username _id')
			.then((post) => {
				if (!post) {
					const error = new Error('Post not found!');
					error.statusCode = 404;
					throw error;
				}
				
				res
					.status(200)
					.json({
						success: true,
						message: 'Post fetched.',
						post
					})
			})
			.catch((error) => {
				if (!error.statusCode) {
					error.statusCode = 500;
				}

				next(error);
			});
	},
	updatePost: (req, res, next) => {
		// Validate post using express-validator
		// Return 422 with errors array if something went wrong
		if (validatePost(req, res)) {
			const postId = req.params.postId;
			const { title, content, imageUrl } = req.body;

			Post
				.findById(postId)
				.then(async (p) => {
					if (!p) {
						const error = new Error('Post not found');
						error.statusCode = 404;
						throw error;
					}

					const user = await User.findById(req.userId);

					if ((p.creator.toString() !== req.userId) && (user.roles.indexOf('Admin') < 0)) {
						const error = new Error('Unauthorized');
						error.statusCode = 403;
						throw error;
					}

					p.title = title;
					p.content = content;
					p.imageUrl = imageUrl;

					return p.save();
				})
				.then((post) => {
					if (post) {
						res.status(200).json({
							success: true,
							message: 'Post updated!',
							post
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
	approvePost: (req, res, next) => {
		const postId = req.params.postId;

        Post
            .findById(postId)
            .then((post) => {
                if (!post) {
                    const error = new Error('Post not found');
                    error.statusCode = 404;
                    throw error;
                }
                post.status = 'Approved';
                return post.save();
            })
            .then((post) => {
                res
                    .status(200)
                    .json({
						success: true,
                        message: 'Post approved!',
                        post
                })
            })
            .catch((error) => {
                if (!error.statusCode) {
                    error.statusCode = 500;
                }

                next(error);
            });
	},
	likePost: (req, res, next) => {
		const postId = req.params.postId;

		Post
			.findById(postId)
			.then((post) => {
				if(post.creator.toString() === req.userId) {
					const error = new Error('You narcissitic bastard, you cannot like your own post!');
					error.statusCode = 422;
					throw error;
				}

				if(post.likes.indexOf(req.userId) !== -1) {
					const error = new Error('You have already liked this post!');
					error.statusCode = 422;
					throw error;
				}

				if(post.hates.indexOf(req.userId) !== -1) {
					post.hates.pull(req.userId);
				}

				post.likes.push(req.userId);
				return post.save();
			})
			.then(() => {
				return Post.findById(postId).populate('likes', 'username _id').populate('hates', 'username _id');
			})
			.then((post) => {
				res.status(200).json({
					success: true,
					message: 'Like noted!',
					post
				})
			})
			.catch((error) => {
				if (!error.statusCode) {
					error.statusCode = 500;
				}

				next(error);
			});
	},
	hatePost: (req, res, next) => {
		const postId = req.params.postId;

		Post
			.findById(postId)
			.then((post) => {
				if(post.creator.toString() === req.userId) {
					const error = new Error('Cannot hate your posts yo!');
					error.statusCode = 422;
					throw error;
				}

				if(post.hates.indexOf(req.userId) !== -1) {
					const error = new Error('You have hated enough this poor post!');
					error.statusCode = 422;
					throw error;
				}

				if(post.likes.indexOf(req.userId) !== -1) {
					post.likes.pull(req.userId);
				}

				post.hates.push(req.userId);
				return post.save();
			})
			.then(() => {
				return Post.findById(postId).populate('hates', 'username _id').populate('likes', 'username _id');
			})
			.then((post) => {
				res.status(200).json({
					success: true,
					message: 'Hate noted!',
					post
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