import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
  handleRequest(err: any, user: any, info: any, context: any, status?: any) {
    if (info?.message === 'jwt expired')
      throw new UnauthorizedException('jwt expired');
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
