const mongoose = require('mongoose');
const encryption = require('../util/encryption');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: Schema.Types.String, required: true },
  hashedPassword: { type: Schema.Types.String, required: true },
  name: { type: Schema.Types.String, required: true },
  salt: { type: Schema.Types.String, required: true },
  translations: [{ type: Schema.Types.ObjectId, ref: 'Word' }],
  roles: [{ type: Schema.Types.String }]
});

userSchema.method({
  authenticate: function (password) {
    const currentHashedPass = encryption.generateHashedPassword(this.salt, password);

    return currentHashedPass === this.hashedPassword;
  }
})

const User = mongoose.model('User', userSchema);

User.seedAdminUser = async () => {
  try {
      let users = await User.find();
      if (users.length > 0) return;
      const salt = encryption.generateSalt();
      const hashedPassword = encryption.generateHashedPassword(salt, '123');
      return User.create({
          email: 'admin@adminov.com',
          salt,
          hashedPassword,
          name: 'PN',
          words: [],
          roles: ['Admin']
      });
  } catch (e) {
      console.log(e);
  }
};

module.exports = User;