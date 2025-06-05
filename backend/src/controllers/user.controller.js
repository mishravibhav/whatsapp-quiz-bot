const { handleAnswer } = require('../services/user.service')

const handleQuizResponse = async (req, res, next) => {
  try {
    const { phone, text,question_text } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const result = await handleAnswer(phone, text,ip,question_text);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { handleQuizResponse };
