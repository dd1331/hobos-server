import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class NaverAuthGuard extends AuthGuard('naver') {
  // constructor(private reflector: Reflector) {
  //   super();
  // }
  // canActivate(context: ExecutionContext) {
  //   // const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
  //   //   context.getHandler(),
  //   //   context.getClass(),
  //   // ]);
  //   // if (isPublic) {
  //   //   return true;
  //   // }
  //   // console.log('context', context.getHandler);
  //   console.log('context', context.switchToHttp());
  //   return super.canActivate(context);
  // }
}
