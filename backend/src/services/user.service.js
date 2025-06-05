const UserSession = require('../models/userSession');
const { getRecommendation, getNextQuestion } = require('../utils/quizLogic');
const { logEvent } = require('./analytics.service');
const getLocationFromIP = require('../utils/ipLocation')

async function getOrCreateSession(number) {
  let session = await UserSession.findOne({ number });
  if (!session) {
    await logEvent(number, 'quiz_started');
    session = await UserSession.create({ number });
  }
  return session;
}

async function handleAnswer(number, text,ip) {
  const session = await getOrCreateSession(number);

  if (session.completed) {
    return { message: "You've already completed the quiz." };
  }

  const { city, state, country } = await getLocationFromIP(ip);

  await logEvent(number, `question_${session.currentQuestion}_answered`, session.currentQuestion,ip,city,state,country);

  session.answers.push(text);
  session.currentQuestion += 1;

  if (session.currentQuestion < 5) {
    const nextQ = getNextQuestion(session.currentQuestion);
    await session.save();
    return { message: nextQ };
  } else {
    session.completed = true;
    await session.save();
    await logEvent(number, 'quiz_completed');
    const recommendation = getRecommendation(session.answers);
    return { message: `Your recommendation: ${recommendation}` };
  }
}

module.exports = {handleAnswer}
