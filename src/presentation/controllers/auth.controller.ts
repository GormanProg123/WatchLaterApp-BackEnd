import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthUseCases } from 'src/applications/usecases/auth.usecases';
import { ForgotPasswordDto } from 'src/domain/dto/forgot-password.dto';
import { ResetPasswordDto } from 'src/domain/dto/reset-password.dto';
import { SignInDto } from 'src/domain/dto/sign-in.dto';
import { SignUpDto } from 'src/domain/dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authUseCases: AuthUseCases) {}
  @Get('ping')
  ping() {
    return { ok: true };
  }

  @Post('sign-up')
  signUp(@Body() dto: SignUpDto) {
    return this.authUseCases.signUp(dto);
  }

  @Post('sign-in')
  signIn(@Body() dto: SignInDto) {
    return this.authUseCases.signIn(dto);
  }

  @Post('logout')
  logout(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');
    if (!token) throw new UnauthorizedException('No token provided');
    return this.authUseCases.logout(token);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authUseCases.forgotPassword(dto);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authUseCases.resetPassword(dto);
  }

  @Post('verify-otp')
  verifyOtp(@Body() dto: { phoneNumber: string; code: string }) {
    return this.authUseCases.verifyOtpOnly(dto.phoneNumber, dto.code);
  }

  @Get('me')
  me(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.authUseCases.me(token);
  }
}
