const mongoose = require('mongoose');
const User = require('./models/User');

const email = 'freeads.testing@gmail.com';
const rawPassword = 'Freeads@123';

mongoose.connect('mongodb://localhost:27017/freeads', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  const passwordHash = User.hashPassword(rawPassword);
  
  let user = await User.findOne({ email });
  if (user) {
    user.passwordHash = passwordHash;
    user.role = 'admin';
    user.isVerified = true;
    await user.save();
    console.log(`Updated existing user ${email} to ADMIN with new password.`);
  } else {
    user = new User({
      name: 'FreeAds Admin',
      email: email,
      passwordHash: passwordHash,
      role: 'admin',
      isVerified: true
    });
    await user.save();
    console.log(`Created new ADMIN user ${email}.`);
  }
  
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
