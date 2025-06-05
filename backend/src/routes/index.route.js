const express = require("express");
const userRoutes = require('./user.routes');
const analyticsRoutes = require('./analytics.routes');

// middleware
const router = express.Router();
router.use("/survey/:surveyId", userRoutes);
router.use("/analytics/:surveyId", analyticsRoutes);


router.get('/health',(req,res)=>{
    res.status(200).json({success: true, response:"health check success"});
})

module.exports = router;