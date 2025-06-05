const errorLogger = async (error, req, res, next) => {
    console.error('\x1b[31m', error.message) // adding some color to our logs
    next(error) // calling next middleware
  }
  
  const errorResponder = async (error, req, res, next) => {
    res.header("Content-Type", 'application/json')
    return res.status(400).json({ success: false, error: error.message })
  }
  
  const invalidPathHandler = async (req, res, next) => {
    res.status(404).send({ success: false, error: `Can't find ${req.originalUrl} on the server` });
  }
  
  const requestLogger = async (req, res, time) => {
    console.log({ req_stat: `${req.method} url:: ${req.url}, time :${time} ms`, resStatusCode: res.statusCode });
  }
  
  
  module.exports = { errorLogger, errorResponder, invalidPathHandler, requestLogger }