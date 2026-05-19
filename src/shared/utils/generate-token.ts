import { JwtService } from '@nestjs/jwt';
import { User } from 'src/infrastructure/database/schemas/user.entity';

export const generateToken = (JwtService: JwtService, user: User): string => {
  return JwtService.sign({
    sub: user.id,
    email: user.email,
  });
};
