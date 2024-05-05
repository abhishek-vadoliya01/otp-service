import { registerAs } from '@nestjs/config';
import { ENV_NAMESPACES } from '../tokens';

export default registerAs(ENV_NAMESPACES.SERVER, () => {
  return {
    port: parseInt(process.env.PORT, 10) || 3000,
    host: process.env.HOST || '127.0.0.1',
    graceful: {
      /** Time server should wait before stopping api services before shutdown */
      apiShutdownDelay: parseFloat(process.env.GRACEFUL_API_SHUTDOWN_DELAY) || 70,
      /** Additional Delay to wait for closing third-party connections and completing miscellaneous tasks before shutdown */
      additionalDelay: parseFloat(process.env.GRACEFUL_ADDITIONAL_DELAY) || 10,
    },
  };
});
