import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';
import { DBCollectionNameTokens } from '../../config';

@Schema({ timestamps: true, collection: DBCollectionNameTokens.OTP })
export class OneTimePassword {
  @Prop({ type: MongoSchema.Types.String, required: true })
  otp: string;

  @Prop({ type: MongoSchema.Types.String, required: true })
  serviceId: string;

  @Prop({ type: MongoSchema.Types.String, required: true })
  contactNumber: string;

  @Prop({ type: MongoSchema.Types.Date, required: true })
  expirationTime: Date;
}

export const OTPSchema = SchemaFactory.createForClass(OneTimePassword);
OTPSchema.index({ expirationTime: 1 }, { expireAfterSeconds: 0 });
OTPSchema.index({ contactNumber: 1, serviceId: 1 }, { unique: true });
export type OTPDocument = OneTimePassword & Document;
