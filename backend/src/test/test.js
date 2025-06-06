const mongoose = require('mongoose');

// 1. MongoDB connection string
const MONGODB_URI = 'mongodb+srv://mishravibhav:Vibhav1610%23@cluster0.rbmmxu8.mongodb.net/quizbot?retryWrites=true&w=majority'; // update this if needed

// 2. Event schema
const eventSchema = new mongoose.Schema({
  number: String,
  event_name: String,
  ip: String,
  city: String,
  state: String,
  country: String,
  event_time: { type: Date, default: Date.now }
});
const Event = mongoose.model('AnalyticsEvent', eventSchema);

// 3. Reporting logic
async function getQuizEngagementReport() {
  try {
    const usersStarted = await Event.distinct('number', { event_name: 'quiz_started' });
    const totalUsersStarted = usersStarted.length;

    const usersCompleted = await Event.distinct('number', { event_name: 'quiz_completed' });
    const totalUsersCompleted = usersCompleted.length;

    const userEvents = await Event.aggregate([
      { $match: { number: { $in: usersStarted } } },
      { $sort: { event_time: 1 } },
      {
        $group: {
          _id: '$number',
          events: {
            $push: {
              event_name: '$event_name',
              event_time: '$event_time'
            }
          }
        }
      }
    ]);

    const stepReachCount = {};
    const stepDropOffCount = {};
    const stepTotalTime = {};
    const stepUserCounts = {};

    userEvents.forEach(({ events }) => {
      let stepsVisited = [];
      for (let i = 0; i < events.length; i++) {
        const ev = events[i];

        const match = ev.event_name.match(/^question_(\d+)_answered$/);
        if (match) {
          const stepIndex = parseInt(match[1]);
          stepsVisited.push({ stepIndex, event_time: new Date(ev.event_time) });

          stepReachCount[stepIndex] = (stepReachCount[stepIndex] || 0) + 1;

          // Time spent = next event - current event
          if (i + 1 < events.length) {
            const nextTime = new Date(events[i + 1].event_time);
            const timeSpent = (nextTime - new Date(ev.event_time)) / 1000;
            stepTotalTime[stepIndex] = (stepTotalTime[stepIndex] || 0) + timeSpent;
            stepUserCounts[stepIndex] = (stepUserCounts[stepIndex] || 0) + 1;
          }
        }
      }

      const completed = events.some(e => e.event_name === 'quiz_completed');
      if (!completed && stepsVisited.length > 0) {
        const lastStep = stepsVisited[stepsVisited.length - 1].stepIndex;
        stepDropOffCount[lastStep] = (stepDropOffCount[lastStep] || 0) + 1;
      }
    });

    const stepDropOffPercent = {};
    const avgTimePerStep = {};

    Object.keys(stepReachCount).forEach(step => {
      const reached = stepReachCount[step];
      const drop = stepDropOffCount[step] || 0;
      stepDropOffPercent[step] = ((drop / reached) * 100).toFixed(2);
    });

    Object.keys(stepTotalTime).forEach(step => {
      avgTimePerStep[step] = (stepTotalTime[step] / stepUserCounts[step]).toFixed(2);
    });

    return {
      totalUsersStarted,
      totalUsersCompleted,
      completionRatePercent: ((totalUsersCompleted / totalUsersStarted) * 100).toFixed(2),
      stepReachCount,
      stepDropOffCount,
      stepDropOffPercent,
      avgTimePerStepInSeconds: avgTimePerStep
    };
  } catch (err) {
    console.error('❌ Error generating report:', err);
    throw err;
  }
}

// 4. Execute
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const report = await getQuizEngagementReport();
    console.log('📊 Quiz Engagement Report:\n', JSON.stringify(report, null, 2));
    await mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });
