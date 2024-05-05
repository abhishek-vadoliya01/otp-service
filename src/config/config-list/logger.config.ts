import { registerAs } from '@nestjs/config';
import { ENV_NAMESPACES } from '../tokens';

/*
  see additional options for logger here:
  https://github.com/pinojs/pino-http#pinohttpopts-stream
*/

const DEVELOPMENT_LOGGER_CONFIGS = {
  quietReqLogger: true, // turn off the default logging output
  level: process.env.LOG_LEVEL || 'debug',
  transport: {
    target: 'pino-pretty', // use the pino-http-print transport and its
    // formatting output
    options: {
      colorize: true,
      levelFirst: true,
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
    },
  },
};

const PRODUCTION_LOGGER_CONFIGS = { level: process.env.LOG_LEVEL || 'debug' };

export default registerAs(ENV_NAMESPACES.LOGGER, () => {
  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    return {
      pinoHttp: PRODUCTION_LOGGER_CONFIGS,
    };
  }
  return {
    pinoHttp: DEVELOPMENT_LOGGER_CONFIGS,
  };
});
