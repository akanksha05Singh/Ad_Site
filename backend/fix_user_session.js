require('dotenv').config({path: './.env'});
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const User = require('./models/User');
  const Listing = require('./models/Listing');
  
  const email = 'akumeenu2@gmail.com';
  
  // Hash the standard password
  const hashedPassword = User.hashPassword('password123');

  // Recreate the user
  let user = await User.findOne({ email });
  if (!user) {
    user = new User({
      name: 'Akumeenu',
      email: email,
      passwordHash: hashedPassword,
      isVerified: true,
      role: 'user'
    });
    await user.save();
    console.log('Created user:', user._id);
  } else {
    console.log('User already exists:', user._id);
  }
  
  // Link orphaned listings
  const updateRes = await Listing.updateMany(
    { contactEmail: email, owner: null },
    { $set: { owner: user._id } }
  );
  
  console.log('Updated listings:', updateRes);
  process.exit(0);
}).catch(console.error);
