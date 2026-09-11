const mongoose = require('mongoose');
const User = require('../models/User'); // relative to where I run it, wait, I will run it from backend so just require('./models/User')
require('dotenv').config();

async function checkUser() {
  await mongoose.connect(process.env.MONGODB_URI);
  const user = await User.findOne({ email: 'singh014akanksha@gmail.com' });
  console.log('User found:', user ? 'YES' : 'NO');
  process.exit();
}

checkUser();
