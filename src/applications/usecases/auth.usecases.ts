import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from 'src/infrastructure/database/schemas/user.entity';
import { SignInDto } from 'src/domain/dto/sign-in.dto';
import { SignUpDto } from 'src/domain/dto/sign-up.dto';
import { generateToken } from 'src/shared/utils/generate-token';
import { excludePassword } from 'src/shared/utils/exclude-password';
import { ForgotPasswordDto } from 'src/domain/dto/forgot-password.dto';
import { TextBeeService } from 'src/infrastructure/services/TextBee.service';
import { PasswordReset } from 'src/infrastructure/database/schemas/password-reset.entity';
import { ResetPasswordDto } from 'src/domain/dto/reset-password.dto';

@Injectable()
export class AuthUseCases {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @InjectRepository(PasswordReset)
    private readonly passwordResetRepository: Repository<PasswordReset>,
    private readonly textBeeService: TextBeeService,
  ) {}

  async signUp(dto: SignUpDto) {
    const { email, password, displayName } = dto;

    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email,
      passwordHash,
      displayName,
    });
    await this.userRepository.save(user);

    const token = generateToken(this.jwtService, user);
    return { user: excludePassword(user), token };
  }

  async signIn(dto: SignInDto) {
    const { email, password } = dto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = generateToken(this.jwtService, user);
    return { user: excludePassword(user), token };
  }

  async logout(token: string): Promise<void> {
    try {
      this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const { phoneNumber } = dto;

    const user = await this.userRepository.findOne({ where: { phoneNumber } });
    if (!user) {
      throw new BadRequestException('No account found with this phone number');
    }

    await this.passwordResetRepository.delete({
      userId: user.id,
      used: false,
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    const passwordReset = this.passwordResetRepository.create({
      userId: user.id,
      code,
      expiresAt,
    });

    await this.passwordResetRepository.save(passwordReset);

    if (user.phoneNumber) {
      try {
        await this.textBeeService.sendOtp(user.phoneNumber, code);
      } catch (error) {
        console.error('Failed to send OTP:', error);
        throw new BadRequestException('Failed to send OTP to phone');
      }
    } else {
      throw new BadRequestException('Phone number not found in profile');
    }

    return {
      message:
        'OTP sent to your registered phone number. Valid for 15 minutes.',
    };
  }

  async verifyOtpOnly(phoneNumber: string, code: string) {
    const user = await this.userRepository.findOne({ where: { phoneNumber } });

    if (!user) throw new UnauthorizedException();

    const resetRecord = await this.passwordResetRepository.findOne({
      where: {
        userId: user.id,
        code,
        used: false,
        expiresAt: MoreThan(new Date()),
      },
    });

    if (!resetRecord) {
      throw new UnauthorizedException('Invalid OTP');
    }

    return { ok: true };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const { phoneNumber, code, newPassword } = dto;

    const user = await this.userRepository.findOne({ where: { phoneNumber } });
    if (!user) {
      throw new UnauthorizedException('Invalid phone number');
    }

    const resetRecord = await this.passwordResetRepository.findOne({
      where: {
        userId: user.id,
        code,
        used: false,
        expiresAt: MoreThan(new Date()),
      },
    });

    if (!resetRecord) {
      throw new UnauthorizedException('Invalid or expired OTP code');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(user.id, { passwordHash });

    resetRecord.used = true;
    await this.passwordResetRepository.save(resetRecord);

    return { message: 'Password reset successfully' };
  }

  async me(token: string) {
    try {
      const payload = this.jwtService.verify(token);

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return excludePassword(user);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
