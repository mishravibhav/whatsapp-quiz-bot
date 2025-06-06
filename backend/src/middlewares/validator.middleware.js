const Joi = require("joi");

const requestSchema = Joi.object({
  phone: Joi.string().pattern(/^\d{10,15}$/).required(),
  question_text: Joi.string().min(1).required(),
  text: Joi.string().min(1).required(),
});

const validateQuizRequest = (req, res, next) => {
  const { error } = requestSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map((d) => d.message).join(", ")
    });
  }

  next();
};

module.exports = { validateQuizRequest };
