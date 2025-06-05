const Joi = require("joi");

const requestSchema = Joi.object({
  phone: Joi.string().pattern(/^\d{10,15}$/).required(), // adjust length as needed
  question_text: Joi.string().min(1).required(),
  text: Joi.string().min(1).required(),
});

const validateQuizRequest = (req, res, next) => {
  const { error } = requestSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: "Invalid request payload",
      details: error.details.map((d) => d.message),
    });
  }

  next();
};

module.exports = {validateQuizRequest};
