import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/infrastructure/database/schemas/user.entity';
import { Item } from 'src/infrastructure/database/schemas/item.entity';
import { Tag } from 'src/infrastructure/database/schemas/tag.entity';
import { Reminder } from 'src/infrastructure/database/schemas/reminder.entity';
import { AuthModule } from 'src/presentation/modules/auth.module';
import { ItemsModule } from 'src/presentation/modules/item.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PasswordReset } from 'src/infrastructure/database/schemas/password-reset.entity';
import { UserModule } from 'src/presentation/modules/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [User, Item, Tag, Reminder, PasswordReset],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    ItemsModule,
    UserModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
