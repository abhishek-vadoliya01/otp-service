import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { OTP_ERROR_TOKENS } from '../../config';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (!request.headers['authorization']) {
      throw new UnauthorizedException(OTP_ERROR_TOKENS.MISSING_API_TOKEN);
    }
    const token = request.headers['authorization'].replace('Bearer ', '');

    if (token !== process.env.AUTH_TOKEN) {
      throw new UnauthorizedException(OTP_ERROR_TOKENS.INVALID_TOKEN);
    }
    return true;
  }
}
