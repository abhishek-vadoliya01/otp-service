import { BeforeApplicationShutdown, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import serverConfig from '../../config/config-list/server.config';

@Injectable()
export class HealthService implements BeforeApplicationShutdown {
  private isAppShuttingDown = false;

  private readonly logger = new Logger(HealthService.name);

  constructor(
    @Inject(serverConfig.KEY)
    private readonly serverConfigurations: ConfigType<typeof serverConfig>,
  ) {}

  isHealthy() {
    if (this.isAppShuttingDown) {
      this.logger.error({
        data: {
          isAppShuttingDown: this.isAppShuttingDown,
        },
      });
      return false;
    }
    return true;
  }

  async beforeApplicationShutdown(signal?: string) {
    this.isAppShuttingDown = true;
    const gracefulConfig = this.serverConfigurations.graceful;
    this.logger.log({ data: { signal, gracefulConfig } }, 'beforeApplicationShutdown : signal received');

    // Handle shutdown of api service
    await this.handleAPIServiceShutdown();

    // Additional Shutdown Delay
    await new Promise((resolve) => {
      setTimeout(async () => {
        resolve(null);
      }, gracefulConfig.additionalDelay * 1000);
    }),
      // Exit the process because it is not exited by default
      this.logger.log('beforeApplicationShutdown : exiting process');
    process.exit(0);
  }

  async handleAPIServiceShutdown() {
    const gracefulConfig = this.serverConfigurations.graceful;

    this.logger.log(`handleAPIServiceShutdown : started for ${gracefulConfig.apiShutdownDelay} seconds`);

    await new Promise((resolve) => {
      setTimeout(() => {
        this.logger.log('handleAPIServiceShutdown : completed');
        resolve(null);
      }, gracefulConfig.apiShutdownDelay * 1000);
    });
  }
}
