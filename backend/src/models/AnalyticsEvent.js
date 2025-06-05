const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  number: String,
  event_name: String,
  questionIndex: Number,
  ip: String,
  city:String,
  state:String,
  country:String,
  event_time: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AnalyticsEvent', eventSchema);