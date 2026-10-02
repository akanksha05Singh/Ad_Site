require('dotenv').config({path: './.env'});
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const User = require('./models/User');
  const users = await User.find({}, 'email name');
  console.log('All users:', users);
  
  const Listing = require('./models/Listing');
  const emptyListings = await Listing.find({ owner: null }, 'title contactEmail');
  console.log('Orphaned listings:', emptyListings);
  
  process.exit(0);
}).catch(console.error);
