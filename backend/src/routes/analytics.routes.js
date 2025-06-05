const express = require('express');
const router = express.Router();
const { exportLogsCSV } = require('../controllers/analytics.controller');

router.get('/export', exportLogsCSV); // GET /analytics/export

module.exports = router;
