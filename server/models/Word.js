const { Schema, model } = require('mongoose');

const wordSchema = new Schema({
    word: { type: Schema.Types.String, required: true, unique: true },
    originLang: { type: Schema.Types.String, required: true },
    translationLangs: [{ type: Schema.Types.String }],
    translations: [{ type: Schema.Types.String }],
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: [{ type: Schema.Types.String, enum: ['Pending', 'Approved'], default: 'Pending' }]
});

const Word = model('Word', wordSchema);

module.exports = Word;

// const { Schema, model } = require('mongoose');

// const wordSchema = new Schema({
//     word: { type: Schema.Types.String, required: true, unique: true },
//     originLang: { type: Schema.Types.String, required: true },
//     translations: [{ type: Schema.Types.ObjectId, ref: 'Translation' }]
// });

// const Word = model('Word', wordSchema);

// module.exports = Word;