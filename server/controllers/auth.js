const { validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const encryption = require('../util/encryption');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

function validateUser(req, res) {
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
	register: (req, res, next) => {
		if (validateUser(req, res)) {
			const { username, email, password } = req.body;
			const salt = encryption.generateSalt();
			const hashedPassword = encryption.generateHashedPassword(salt, password);

			User
				.create({
					username,
					email,
					salt,
					hashedPassword,
					roles: ['User']
				})
				.then((user) => {

					const token = jwt.sign({
						username: user.username,
						userId: user._id.toString()
					}, config.JWTSecret, {
						expiresIn: '1h'
					});

					res.status(201)
						.json({
							success: true,
							message: `User created successfully! Welcome, ${user.username}!`,
							token,
							userId: user._id,
							username: user.username,
							isAdmin: user.roles.indexOf('Admin') !== -1,
						});
				})
				.catch((error) => {
					if (!error.statusCode) {
						error.statusCode = 500;
					}
					next(error);
				});
		}
	},
	login: (req, res, next) => {
		const { username, password } = req.body;

		if (validateUser(req, res)) {
			User
				.findOne({
					username
				})
				.then((user) => {
					if (!user) {
						const error = new Error('Invalid username OR/AND password');
						error.statusCode = 401;
						throw error;
					}

					if (!user.authenticate(password)) {
						const error = new Error('Invalid username OR/AND password');
						error.statusCode = 401;
						throw error;
					}

					const token = jwt.sign({
						username: user.username,
						userId: user._id.toString()
					}, config.JWTSecret, {
						expiresIn: '1h'
					});

					res.status(200).json({
						success: true,
						message: `You have successfully logged in, ${user.username}!`,
						token,
						userId: user._id.toString(),
						username: user.username,
						isAdmin: user.roles.indexOf('Admin') !== -1,
					});
				})
				.catch(error => {
					if (!error.statusCode) {
						error.statusCode = 500;
					}

					next(error);
				})
		}
	},
	getMyPosts: (req, res, next) => {
		const userId = req.userId;

		User
			.findById(userId)
			.populate('posts')
			.then(user => {
				res
					.status(200)
					.json({
						success: true,
						message: `Here are your posts, ${user.username}!`,
						posts: user.posts
				});
			})
			.catch(error => {
				if (!error.statusCode) {
					error.statusCode = 500;
				}

				next(error);
			})
	}
}