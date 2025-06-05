const questions = [
    {
        type: "text",
        _meta: "phone",
        name:"phone",
        title: "Enter your phone number",
        isRequired: true
      },
    {
      type: "radiogroup",
      _meta: "budget",
      name:"text",
      title: "What is your budget range?",
      choices: ["low", "medium", "high"],
      isRequired: true,
      showClearButton: false
    },
    {
      type: "radiogroup",
      _meta: "coverage",
      name:"text",
      title: "Do you prefer indoor or outdoor coverage?",
      choices: ["indoor", "outdoor", "both"],
      isRequired: true,
      showClearButton: false
    },
    {
      type: "text",
      _meta: "camera_count",
      name:"text",
      title: "How many cameras do you need?",
      isRequired: true
    },
    {
      type: "radiogroup",
      _meta: "night_vision",
      name:"text",
      title: "Do you want night vision?",
      choices: ["Yes", "No"],
      isRequired: true,
      showClearButton: false
    },
    {
      type: "radiogroup",
      _meta: "connection",
      name:"text",
      title: "Do you prefer wired or wireless?",
      choices: ["wired", "wireless"],
      isRequired: true,
      showClearButton: false
    }
  ];
  
  const recommendations = {
    low: "🔒 Recommendation: BasicCam - ₹4,999",
    medium: "🔒 Recommendation: SafeHome 360 - ₹9,999",
    high: "🔒 Recommendation: UltraSecure Pro - ₹14,999"
  };
  

  const getNextQuestion = (answeredData) => {
    // console.log('answeredData',answeredData)
    const questionKeys = questions.map((q) => q._meta);
    // console.log('questionKeys',questionKeys)
    const answeredCount = questionKeys.filter((q) => answeredData?.hasOwnProperty(q)).length;
    // console.log('answeredCount',answeredCount)
    return questions[answeredData] || null;
  };
  

  const getRecommendation = (answersArray = []) => {

    console.log("answersArray",answersArray)
    if (!Array.isArray(answersArray)) return null;
  
    for (const item of answersArray) {
      try {
        const parsed = JSON.parse(item);
        const questionText = Object.keys(parsed)[0];
        const answer = parsed[questionText];
  
        if (questionText === "What is your budget range?") {
          return recommendations[answer.toLowerCase()] || recommendations.medium;
        }
      } catch (err) {
        console.error("Invalid answer format:", item);
      }
    }
  
    return null; // No matching question found
  };
  
  module.exports = { questions, getNextQuestion, getRecommendation };