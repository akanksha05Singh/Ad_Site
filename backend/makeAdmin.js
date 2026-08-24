const mongoose = require('mongoose');

async function makeAdmin() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/freeads');
    
    const User = require('./models/User');
    
    const email = 'akumeenu2@gmail.com';
    const result = await User.findOneAndUpdate({ email: email }, { role: 'admin' }, { new: true });
    
    if (result) {
      console.log(`Successfully made ${email} an admin!`);
    } else {
      console.log(`User ${email} not found.`);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

makeAdmin();
