// middlewares/requestLogger.js
import pinoHttp from 'pino-http';
import logger from '../utils/logger.js';

const requestLogger = pinoHttp({
  logger,
  customLogLevel(res, err) {
    if (err) return 'error';
    if (!res.statusCode || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage(res) {
    const req = res.req || {};
    return `✅ ${req.method || 'UNKNOWN'} ${req.url || '/'} - ${res.statusCode || 200}`;
  },
  customErrorMessage(err, res) {
    const req = res?.req || {};
    const status = res?.statusCode || err.status || 500;
    return `[ERROR] ${req.method || 'UNKNOWN'} ${req.url || '/'} - ${status} - ${err.message || err.toString()}`;
  }
});

export default requestLogger;