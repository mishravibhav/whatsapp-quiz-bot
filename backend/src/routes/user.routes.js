const express = require('express');
const router = express.Router();
const { handleQuizResponse } = require('../controllers/user.controller');
const validateaPayload = require('../middlewares/validator.middleware').validateQuizRequest

// POST /quiz/respond
router.post('/respond',validateaPayload, handleQuizResponse);

module.exports = router;
