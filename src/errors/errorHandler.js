import errorDictionary from './errorDictionary.js';

export function errorHandler(err, req, res, next) {
  const error = errorDictionary[err.type] || errorDictionary.GENERAL_ERROR;
  res.status(err.status || 500).json({
    error: {
      code: error.code,
      message: error.message,
      details: err.details || null
    }
  });
}