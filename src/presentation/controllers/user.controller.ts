import {
  Controller,
  Patch,
  Headers,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserUseCases } from 'src/applications/usecases/user.usecases';
import { UpdateEmailDto } from 'src/domain/dto/update-email.dto';
import { UpdatePhoneDto } from 'src/domain/dto/update-phone.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userUseCases: UserUseCases,
    private readonly jwtService: JwtService,
  ) {}

  private getUserId(authHeader: string): string {
    const token = authHeader?.replace('Bearer ', '');
    if (!token) throw new UnauthorizedException('No token provided');
    try {
      const payload = this.jwtService.verify(token);
      return payload.sub;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Patch('phone')
  updatePhoneNumber(
    @Headers('authorization') auth: string,
    @Body() dto: UpdatePhoneDto,
  ) {
    const userId = this.getUserId(auth);
    return this.userUseCases.updatePhoneNumber(userId, dto.phoneNumber);
  }

  @Patch('email')
  updateEmail(
    @Headers('authorization') auth: string,
    @Body() dto: UpdateEmailDto,
  ) {
    const userId = this.getUserId(auth);
    return this.userUseCases.updateEmail(userId, dto.email);
  }
}
