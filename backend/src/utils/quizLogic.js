const questions = [
    "What's your budget range? (low/medium/high)",
    "Do you prefer indoor or outdoor coverage?",
    "How many cameras do you need?",
    "Do you want night vision?",
    "Do you prefer wired or wireless?"
  ];
  
  const recommendations = {
    low: "BasicCam - $99",
    medium: "SafeHome 360 - $199",
    high: "UltraSecure Pro - $349"
  };
  
  const getNextQuestion = (index) => questions[index] || null;
  
  const getRecommendation = (answers) => {
    if (answers[0] === "low") return recommendations.low;
    if (answers[0] === "medium") return recommendations.medium;
    return recommendations.high;
  };
  
  module.exports = { questions, getNextQuestion, getRecommendation };
  