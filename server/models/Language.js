const { Schema, model } = require('mongoose');

const languageSchema = new Schema({
    name: { type: Schema.Types.String, required: true, unique: true },
    words: [{ type: Schema.Types.ObjectId, ref: 'Word' }],
    langRelations: [{ type: Schema.Types.ObjectId, ref: 'Language' }]
});

const Language = model('Language', languageSchema);

module.exports = Language;