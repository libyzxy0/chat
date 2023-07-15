const { CustomAPIError } = require('../errors/custom-error')
const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }
  return res.status(500).json({ code: 400, message: 'Something went wrong!, please contact the site owner (libyzxy0).' })
}

module.exports = errorHandlerMiddleware
