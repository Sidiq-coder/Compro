// middlewares/requestLogger.js
import pinoHttp from 'pino-http';
import logger from '../utils/logger.js';

const requestLogger = pinoHttp({
  logger,
  customLogLevel(req, res, err) {
    if (err) return 'error';
    if (!res.statusCode || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage(req, res) {
    return `${req.method || 'UNKNOWN'} ${req.url || req.originalUrl || '/'} - ${res.statusCode || 200}`;
  },
  customErrorMessage(req, res, err) {
    const status = res?.statusCode || err.status || 500;
    return `${req.method || 'UNKNOWN'} ${req.url || req.originalUrl || '/'} - ${status} - ${err.message || err.toString()}`;
  }
});

export default requestLogger;