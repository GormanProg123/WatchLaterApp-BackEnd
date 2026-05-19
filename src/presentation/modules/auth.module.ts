import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { User } from 'src/infrastructure/database/schemas/user.entity';
import { AuthUseCases } from 'src/applications/usecases/auth.usecases';
import { AuthController } from 'src/presentation/controllers/auth.controller';
import { TextBeeService } from 'src/infrastructure/services/TextBee.service';
import { PasswordReset } from 'src/infrastructure/database/schemas/password-reset.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, PasswordReset]),
    JwtModule.registerAsync({
      imports: [ConfigModule],

      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN', '7d') as any,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthUseCases, TextBeeService],
  exports: [AuthUseCases, JwtModule, TextBeeService],
})
export class AuthModule {}
