import { JwtService } from '@nestjs/jwt';
import { User } from 'src/infrastructure/database/schemas/user.entity';

export const generateToken = (jwtService: JwtService, user: User): string => {
  return jwtService.sign(
    {
      sub: user.id,
      email: user.email,
    },
    {
      expiresIn: (process.env.JWT_EXPIRES_IN ??
        '1d') as `${number}${'s' | 'm' | 'h' | 'd'}`,
    },
  );
};
