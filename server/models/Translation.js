const { Schema, model } = require('mongoose');

const translationSchema = new Schema({
    //word: { type: Schema.Types.ObjectId, ref: 'Word', required: true },
    translationLangs: [{ type: Schema.Types.ObjectId, ref: 'Language', required: true }],
    translation: { type: Schema.Types.String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: Schema.Types.String, enum: ['Pending', 'Approved'], default: 'Pending' }
});

const Translation = model('Translation', translationSchema);

module.exports = Translation;

