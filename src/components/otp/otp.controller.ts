import { Body, Controller, Post, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { OTPService } from './otp.service';
import { AuthGuard } from '../../common/authentication/authentication.guard';
import { GenerateOtpDTO } from './dtos/generate-otp.dto';
import { VerifyOtpDTO } from './dtos/verify-otp.dto';

@Controller('otp')
export class OTPController {
  constructor(private readonly otpService: OTPService) {}

  @UseGuards(AuthGuard)
  @Post('generate')
  async generateOTP(@Body(ValidationPipe) generateOTPData: GenerateOtpDTO, @Res() reply: FastifyReply) {
    const data = await this.otpService.generateOTP(generateOTPData);
    reply.code(200).send(data);
  }

  @UseGuards(AuthGuard)
  @Post('verify')
  async verifyOTP(@Body() verifyOTPData: VerifyOtpDTO, @Res() reply: FastifyReply) {
    const data = await this.otpService.verifyOTP(verifyOTPData);
    reply.code(200).send(data);
  }
}
