import { IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyOtpDTO {
  @IsNotEmpty()
  @IsString()
  contactNumber: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 6, { message: 'OTP must be 6 characters long' })
  otp: string;

  @IsNotEmpty()
  @IsString()
  serviceId: string;
}
