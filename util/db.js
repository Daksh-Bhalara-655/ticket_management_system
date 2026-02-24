const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ticketmanagement';

async function connect() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  try {
    await mongoose.connect(MONGO_URI);
    return mongoose.connection;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

module.exports = { connect };
