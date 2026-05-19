import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserUseCases } from 'src/applications/usecases/user.usecases';
import { User } from 'src/infrastructure/database/schemas/user.entity';
import { UserController } from 'src/presentation/controllers/user.controller';
import { AuthModule } from 'src/presentation/modules/auth.module';
import { NotificationModule } from 'src/presentation/modules/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule, NotificationModule],
  controllers: [UserController],
  providers: [UserUseCases],
})
export class UserModule {}
