const express = require('express');
const router = express.Router();
const { getQuizEngagementReportController,getSurveyLogsController } = require('../controllers/analytics.controller');

router.get('/aggrigated-report', getQuizEngagementReportController);
router.get('/survey-logs', getSurveyLogsController);

module.exports = router;
