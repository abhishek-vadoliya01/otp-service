import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OTPSchema } from './otp.schema';
import { DBCollectionNameTokens } from '../../config';
import { OTPController } from './otp.controller';
import { OTPService } from './otp.service';
import { OTPRepository } from './otp.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DBCollectionNameTokens.OTP,
        schema: OTPSchema,
      },
    ]),
  ],
  controllers: [OTPController],
  providers: [OTPService, OTPRepository],
})
export class OTPModule {}
