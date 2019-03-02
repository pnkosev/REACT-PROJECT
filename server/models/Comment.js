const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
	content: { type: Schema.Types.String, required: true },
	creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
	status: { type: Schema.Types.String, enum: ['Pending', 'Approved'], default: 'Pending' },
});

const Comment = model('Comment', commentSchema);

module.exports = Comment;