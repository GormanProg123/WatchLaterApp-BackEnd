import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/infrastructure/database/schemas/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserUseCases {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async updatePhoneNumber(userId: string, phoneNumber: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) throw new UnauthorizedException();

    user.phoneNumber = phoneNumber;
    await this.userRepository.save(user);

    return { success: true };
  }

  async updateEmail(userId: string, email: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) throw new UnauthorizedException();

    if (user.email === email) {
      return { success: true };
    }

    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    user.email = email;
    await this.userRepository.save(user);

    return { success: true };
  }
}
