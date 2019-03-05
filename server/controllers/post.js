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
	getPosts: (req, res, next) => {
		// Retrieve all posts in JSON format
		Post.find()
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
			const { title, content } = req.body;

			const post = new Post({
				title,
				content,
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
							message: 'Post created successfully!',
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

		Post.findById(postId)
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
					Comment.deleteMany({post: postId})
				]);
			})
			.then(() => {
				return User.findById(req.userId);
			})
			.then((user) => {
				user.posts.pull(postId);
				return user.save();
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
			.populate('comments')
			//.where('status', 'Approved')
			.populate('likes')
			.populate('hates')
			.populate('creator')
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
			const { title, content } = req.body;

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
	}
}