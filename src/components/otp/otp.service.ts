import { HttpException, Injectable, Logger } from '@nestjs/common';
import { OTPRepository } from './otp.repository';
import { GenerateOtpDTO } from './dtos/generate-otp.dto';
import { customAlphabet } from 'nanoid';
import * as chrono from 'chrono-node';
import dayjs from 'dayjs';
import { VerifyOtpDTO } from './dtos/verify-otp.dto';
import { OTP_ERROR_TOKENS } from '../../config';

@Injectable()
export class OTPService {
  private readonly logger = new Logger(OTPService.name);

  constructor(private readonly otpRepository: OTPRepository) {}

  async generateOTP(generateOTPData: GenerateOtpDTO) {
    try {
      const regenerateOTP = generateOTPData.regenerateOTP === true;
      const { serviceId, validity } = generateOTPData;
      const contactNumber = generateOTPData.contactNumber.replace(/[+\s]/g, '');
      const nanoId = customAlphabet('0123456789', 6);

      const existingOTPData = await this.otpRepository.findOne({ contactNumber, serviceId });
      if (existingOTPData && !regenerateOTP) {
        return {
          success: true,
          statusCode: 200,
          existingOTP: true,
          otp: existingOTPData.otp,
          expirationTime: existingOTPData.expirationTime.getTime(),
        };
      }
      if (existingOTPData && regenerateOTP) {
        await this.otpRepository.deleteOTP({ contactNumber, serviceId, otp: existingOTPData.otp });
      }

      const defaultExpiration = dayjs().add(15, 'minutes').toDate();
      const expirationTime = validity ? chrono.parseDate(`after ${validity}`) : defaultExpiration;

      const otp = nanoId();
      await this.otpRepository.insertOTP({
        serviceId,
        contactNumber,
        otp,
        expirationTime,
      });
      return {
        success: true,
        statusCode: 200,
        otp,
        expirationTime: expirationTime.getTime(),
      };
    } catch (error) {
      this.logger.error(`${OTP_ERROR_TOKENS.GET_OTP_ERROR}: ${error}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(OTP_ERROR_TOKENS.GET_OTP_ERROR, 500);
    }
  }

  async verifyOTP(verifyOTPData: VerifyOtpDTO) {
    try {
      const { serviceId, otp } = verifyOTPData;
      const contactNumber = verifyOTPData.contactNumber.replace(/[+\s]/g, '');
      const otpData = await this.otpRepository.findOne({ contactNumber, serviceId, otp });
      /** we are checking current > expirationTime because mongodb deletes documents every 60 seconds 
          and if document is still present in db after expirationTime then we have to throw an error */
      if (!otpData || new Date() > otpData.expirationTime) {
        throw new HttpException(OTP_ERROR_TOKENS.INVALID_OTP, 400);
      } else {
        await this.otpRepository.deleteOTP({ contactNumber, serviceId, otp });
        return {
          success: true,
          statusCode: 200,
        };
      }
    } catch (error) {
      this.logger.error(`${OTP_ERROR_TOKENS.VERIFY_OTP_ERROR}: ${error}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(OTP_ERROR_TOKENS.VERIFY_OTP_ERROR, 500);
    }
  }
}
