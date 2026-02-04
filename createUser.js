// run with: node createUser.js alice password123
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGO_URI = process.env.MONGO_URI;
const username = process.argv[2];
const password = process.argv[3];
if (!username || !password) {
  console.error('usage: node createUser.js <username> <password>');
  process.exit(1);
}
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const userSchema = new mongoose.Schema({
      username: String,
      passwordHash: String
    });
    const User = mongoose.model('UserUtil', userSchema);
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ username, passwordHash });
    console.log('user created');
    process.exit(0);
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
