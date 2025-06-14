const AnalyticsEvent = require('../models/AnalyticsEvent'); // Mongoose model
const tryCatch = require('../utils/tryCatch')

const getQuizEngagementReportController = async (req, res) => {
  try {
    const usersStarted = await AnalyticsEvent.distinct('number', { event_name: 'quiz_started' });
    const totalUsersStarted = usersStarted.length;

    const usersCompleted = await AnalyticsEvent.distinct('number', { event_name: 'quiz_completed' });
    const totalUsersCompleted = usersCompleted.length;

    const userEvents = await AnalyticsEvent.aggregate([
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

    const report = {
      totalUsersStarted,
      totalUsersCompleted,
      completionRatePercent:
        totalUsersStarted > 0
          ? ((totalUsersCompleted / totalUsersStarted) * 100).toFixed(2)
          : '0.00',
      stepReachCount,
      stepDropOffCount,
      stepDropOffPercent,
      avgTimePerStepInSeconds: avgTimePerStep
    };

    res.status(200).json({ success: true, response: report });
  } catch (err) {
    console.error('❌ Error generating report:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};


const getSurveyLogsController = tryCatch(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
  
    const total = await AnalyticsEvent.countDocuments();
    const logs = await AnalyticsEvent.find()
      .sort({ event_time: -1 }) // Most recent first
      .skip(skip)
      .limit(limit)
      .lean();
  
    res.status(200).json({
      success: true,
      response: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        data: logs
      }
    });
  });
  

module.exports = { getQuizEngagementReportController,getSurveyLogsController };
