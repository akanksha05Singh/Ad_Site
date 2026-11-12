const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/freeads').then(async () => {
  const res = await mongoose.connection.db.collection('listings').updateMany(
    { status: 'active', isScraped: false },
    { $set: { status: 'pending' } }
  );
  console.log("Updated", res.modifiedCount, "listings to pending.");
  process.exit(0);
});
