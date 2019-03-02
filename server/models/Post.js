const { Schema, model } = require('mongoose');

const postSchema = new Schema({
	title: { type: Schema.Types.String, required: true },
	content: { type: Schema.Types.String, required: true },
	creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	likes: [{ type: Schema.Types.ObjectId, ref:'User'}],
	hates: [{ type: Schema.Types.ObjectId, ref:'User'}],
	comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

const Post = model('Post', postSchema);

module.exports = Post;