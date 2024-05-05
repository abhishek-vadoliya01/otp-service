import { IsBoolean, IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator';
import { ValidityFormatValidator } from '../../../common/validator/validity-format.validator';

export class GenerateOtpDTO {
  @IsNotEmpty()
  @IsString()
  contactNumber: string;

  @IsNotEmpty()
  @IsString()
  serviceId: string;

  @IsOptional()
  @Validate(ValidityFormatValidator)
  validity: string;

  @IsOptional()
  @IsBoolean()
  regenerateOTP: boolean;
}
