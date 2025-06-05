const mongoose = require('mongoose');

const userSessionSchema = new mongoose.Schema({
  number: { type: String, required: true },
  currentQuestion: { type: Number, default: 0 },
  answers: [String],
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserSession', userSessionSchema);
