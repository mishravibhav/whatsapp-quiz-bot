const { handleAnswer } = require('../services/user.service')

const handleQuizResponse = async (req, res, next) => {
  try {
    const { number, text } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const result = await handleAnswer(number, text,ip);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { handleQuizResponse };
