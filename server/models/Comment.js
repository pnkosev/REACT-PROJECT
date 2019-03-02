const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
	content: { type: Schema.Types.String, required: true },
	creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	post: { type: Schema.Types.ObjectId, ref: 'Post' },
});

const Comment = model('Comment', commentSchema);

module.exports = Comment;