const express = require('express');
const router = express.Router();
const { handleQuizResponse } = require('../controllers/user.controller');

// POST /quiz/respond
router.post('/respond', handleQuizResponse);

module.exports = router;
