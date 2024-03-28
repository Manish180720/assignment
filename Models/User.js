const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  eventsAttended: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event', // Assuming Event is another model
    },
  ],
  reviews: [
    {
      eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
      reviewText: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  ratings: {
    registration: { type: Number, default: 0 },
    event: { type: Number, default: 0 },
    breakfast: { type: Number, default: 0 },
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
