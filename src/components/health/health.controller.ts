import { Controller, Get, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { HealthService } from './health.service';

@Controller('healthCheck')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get(['/', '/:type'])
  healthCheck(@Res() reply: FastifyReply) {
    if (!this.healthService.isHealthy()) {
      return reply.code(500).send({});
    }
    return reply.code(200).send({});
  }
}
