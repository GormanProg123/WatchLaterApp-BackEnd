import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationService } from 'src/infrastructure/services/notification.service';
import { Item } from 'src/infrastructure/database/schemas/item.entity';
import { Reminder } from 'src/infrastructure/database/schemas/reminder.entity';
import { User } from 'src/infrastructure/database/schemas/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item, Reminder, User])],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
