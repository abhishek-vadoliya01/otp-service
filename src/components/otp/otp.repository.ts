import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType } from 'mongoose';
import { DBCollectionNameTokens } from '../../config';
import { OneTimePassword, OTPDocument } from './otp.schema';
import { OTP_ERROR_TOKENS } from '../../config';

@Injectable()
export class OTPRepository {
  private readonly logger = new Logger(OTPRepository.name);
  constructor(
    @InjectModel(DBCollectionNameTokens.OTP)
    private readonly otpModel: Model<OTPDocument>,
  ) {}

  async findOne(filter: FilterQuery<OTPDocument>, projection?: ProjectionType<OTPDocument>): Promise<OTPDocument> {
    try {
      return await this.otpModel.findOne(filter, projection).lean();
    } catch (error) {
      this.logger.error(`Error while finding OTP: ${error}`);
      throw new HttpException(
        {
          code: 'FIND_OTP_FROM_DB_ERROR',
          message: OTP_ERROR_TOKENS.READ_DB_RECORD_ERROR,
          error,
        },
        500,
      );
    }
  }

  async insertOTP(data: OneTimePassword): Promise<OTPDocument> {
    try {
      return await this.otpModel.create(data);
    } catch (error) {
      this.logger.error(`Error while adding OTP: ${error}`);
      throw new HttpException(
        {
          code: 'ADD_OTP_TO_DB_ERROR',
          message: OTP_ERROR_TOKENS.CREATE_DB_RECORD_ERROR,
          error,
        },
        500,
      );
    }
  }

  async deleteOTP(filter: FilterQuery<OTPDocument>): Promise<void> {
    try {
      await this.otpModel.deleteOne(filter);
    } catch (error) {
      this.logger.error(`Error while deleting OTP: ${error}`);
      throw new HttpException(
        {
          code: 'DELETE_OTP_FROM_DB_ERROR',
          message: OTP_ERROR_TOKENS.DELETE_DB_RECORD_ERROR,
          error,
        },
        500,
      );
    }
  }
}
