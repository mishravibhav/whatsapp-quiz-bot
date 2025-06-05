const AnalyticsEvent = require('../models/AnalyticsEvent');

const logEvent = async (number, event_name, questionIndex = null,ip=null,city=null,state=null,country=null) => {
  await AnalyticsEvent.create({
    number,
    event_name,
    questionIndex,
    ip,
    city,
    state,
    country
  });
};

module.exports = { logEvent };
