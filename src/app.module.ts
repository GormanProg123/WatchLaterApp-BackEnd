import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { User } from 'src/infrastructure/database/schemas/user.entity';
import { Item } from 'src/infrastructure/database/schemas/item.entity';
import { Tag } from 'src/infrastructure/database/schemas/tag.entity';
import { Reminder } from 'src/infrastructure/database/schemas/reminder.entity';
import { PasswordReset } from 'src/infrastructure/database/schemas/password-reset.entity';

import { AuthModule } from 'src/presentation/modules/auth.module';
import { ItemsModule } from 'src/presentation/modules/item.module';
import { UserModule } from 'src/presentation/modules/user.module';

import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');

        if (!databaseUrl) {
          throw new Error(
            'DATABASE_URL is not defined. Set the DATABASE_URL environment variable in your deployment environment.',
          );
        }

        return {
          type: 'postgres',
          url: databaseUrl,
          ssl: {
            rejectUnauthorized: false,
          },
          entities: [User, Item, Tag, Reminder, PasswordReset],
          synchronize: false,
          autoLoadEntities: true,
        };
      },
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
