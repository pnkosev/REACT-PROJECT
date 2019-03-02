const { Schema, model } = require('mongoose');
const encryption = require('../util/encryption');

const userSchema = new Schema({
  username: { type: Schema.Types.String, required: true },
  salt: { type: Schema.Types.String, required: true },
  hashedPassword: { type: Schema.Types.String, required: true },
  email: { type: Schema.Types.String, required: true },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  roles: [{ type: Schema.Types.String }]
});

userSchema.method({
  authenticate: function (password) {
    const currentHashedPass = encryption.generateHashedPassword(this.salt, password);

    return currentHashedPass === this.hashedPassword;
  }
})

const User = model('User', userSchema);

User.seedAdminUser = async () => {
  try {
      let users = await User.find();
      if (users.length > 0) return;
      const salt = encryption.generateSalt();
      const hashedPassword = encryption.generateHashedPassword(salt, '123');
      return User.create({
          username: 'admin',
          salt,
          hashedPassword,
          email: 'admin@adminov.com',
          posts: [],
          comments: [],
          roles: ['Admin']
      });
  } catch (e) {
      console.log(e);
  }
};

module.exports = User;