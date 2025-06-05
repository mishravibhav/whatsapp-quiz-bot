const AnalyticsEvent = require('../models/AnalyticsEvent');
const { Parser } = require('json2csv');

const exportLogsCSV = async (req, res) => {
  try {
    const logs = await AnalyticsEvent.find().lean();
    const fields = ['number', 'event', 'questionIndex', 'timestamp'];
    const parser = new Parser({ fields });
    const csv = parser.parse(logs);
    res.header('Content-Type', 'text/csv');
    res.attachment('analytics_logs.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: 'Failed to export logs', details: err.message });
  }
};

module.exports = { exportLogsCSV };
